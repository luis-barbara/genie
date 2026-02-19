import { NextRequest, NextResponse } from "next/server";

const GH_API = "https://api.github.com";

type GHHeaders = {
  Authorization: string;
  Accept: string;
  "Content-Type": string;
  "X-GitHub-Api-Version": string;
};

function ghHeaders(token: string): GHHeaders {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function ghFetch(url: string, token: string, opts?: RequestInit) {
  const res = await fetch(url, {
    ...opts,
    headers: { ...ghHeaders(token), ...(opts?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `GitHub API error ${res.status}`);
  }
  return res.json();
}

interface FilePayload {
  path: string;
  content?: string;
  action: "created" | "modified" | "deleted";
}

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO; // e.g. "owner/repo"

  if (!token || !repoFull) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN and GITHUB_REPO environment variables are required." },
      { status: 500 },
    );
  }

  const body = await req.json() as {
    files: FilePayload[];
    title?: string;
    description?: string;
    baseBranch?: string;
  };

  const { files, title, description, baseBranch = "main" } = body;

  if (!files?.length) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  const [owner, repo] = repoFull.split("/");
  const branch = `genie/change-${Date.now()}`;
  const prTitle = title ?? "Genie: automated change";
  const prBody  = description
    ? `${description}\n\n---\n*Created automatically by [Genie](https://github.com/geniehq/genie)*`
    : "*Created automatically by Genie*";

  try {
    // 1. Get base branch SHA
    const baseRef = await ghFetch(`${GH_API}/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`, token);
    const baseSha: string = baseRef.object.sha;

    // 2. Build a new tree
    const treeItems = await Promise.all(
      files
        .filter((f) => f.action !== "deleted")
        .map(async (f) => {
          const contentB64 = Buffer.from(f.content ?? "", "utf-8").toString("base64");
          // Create blob
          const blob = await ghFetch(`${GH_API}/repos/${owner}/${repo}/git/blobs`, token, {
            method: "POST",
            body: JSON.stringify({ content: contentB64, encoding: "base64" }),
          }) as { sha: string };
          return {
            path: f.path,
            mode: "100644",
            type: "blob",
            sha: blob.sha,
          };
        }),
    );

    // Handle deletions
    const deletions = files
      .filter((f) => f.action === "deleted")
      .map((f) => ({ path: f.path, mode: "100644", type: "blob", sha: null }));

    const newTree = await ghFetch(`${GH_API}/repos/${owner}/${repo}/git/trees`, token, {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseSha,
        tree: [...treeItems, ...deletions],
      }),
    }) as { sha: string };

    // 3. Create commit
    const changedNames = files.map((f) => f.path).join(", ");
    const commit = await ghFetch(`${GH_API}/repos/${owner}/${repo}/git/commits`, token, {
      method: "POST",
      body: JSON.stringify({
        message: `${prTitle}\n\nFiles: ${changedNames}`,
        tree: newTree.sha,
        parents: [baseSha],
      }),
    }) as { sha: string };

    // 4. Create branch ref
    await ghFetch(`${GH_API}/repos/${owner}/${repo}/git/refs`, token, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
    });

    // 5. Create PR
    const pr = await ghFetch(`${GH_API}/repos/${owner}/${repo}/pulls`, token, {
      method: "POST",
      body: JSON.stringify({
        title: prTitle,
        body: prBody,
        head: branch,
        base: baseBranch,
        draft: false,
      }),
    }) as { html_url: string; number: number };

    return NextResponse.json({
      prUrl: pr.html_url,
      prNumber: pr.number,
      branch,
    });

  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
