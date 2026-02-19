import { NextRequest, NextResponse } from "next/server";

/**
 * Triggers a new Vercel production deployment using a deploy hook URL.
 *
 * Required env vars:
 *   VERCEL_DEPLOY_HOOK  — the hook URL from Vercel project settings
 *                         e.g. https://api.vercel.com/v1/integrations/deploy/…
 *
 * Optional env vars:
 *   VERCEL_TOKEN + VERCEL_PROJECT_ID  — used to poll deployment status
 */
export async function POST(req: NextRequest) {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;

  if (!hookUrl) {
    return NextResponse.json(
      { error: "VERCEL_DEPLOY_HOOK environment variable is not set." },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({})) as { ref?: string };

  try {
    const url = body.ref ? `${hookUrl}?ref=${encodeURIComponent(body.ref)}` : hookUrl;
    const res = await fetch(url, { method: "POST" });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Vercel deploy hook returned ${res.status}: ${text}` },
        { status: 502 },
      );
    }

    const data = await res.json().catch(() => ({})) as { job?: { id?: string } };
    const jobId = data?.job?.id;

    // Optionally fetch deployment status URL from Vercel API
    const vercelToken   = process.env.VERCEL_TOKEN;
    const vercelProject = process.env.VERCEL_PROJECT_ID;
    let deployUrl: string | null = null;

    if (vercelToken && vercelProject && jobId) {
      const infoRes = await fetch(
        `https://api.vercel.com/v13/deployments/${jobId}`,
        { headers: { Authorization: `Bearer ${vercelToken}` } },
      );
      if (infoRes.ok) {
        const info = await infoRes.json() as { url?: string };
        deployUrl = info.url ? `https://${info.url}` : null;
      }
    }

    return NextResponse.json({ triggered: true, jobId, deployUrl });

  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

/** GET: returns current deployment status */
export async function GET() {
  const vercelToken   = process.env.VERCEL_TOKEN;
  const vercelProject = process.env.VERCEL_PROJECT_ID;

  if (!vercelToken || !vercelProject) {
    return NextResponse.json({ configured: false });
  }

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${vercelProject}&limit=1`,
      { headers: { Authorization: `Bearer ${vercelToken}` } },
    );
    if (!res.ok) return NextResponse.json({ configured: true, status: "unknown" });

    const data = await res.json() as { deployments?: { state: string; url: string; createdAt: number }[] };
    const latest = data.deployments?.[0];

    return NextResponse.json({
      configured: true,
      status: latest?.state ?? "unknown",
      url: latest?.url ? `https://${latest.url}` : null,
      createdAt: latest?.createdAt ?? null,
    });
  } catch {
    return NextResponse.json({ configured: true, status: "unknown" });
  }
}
