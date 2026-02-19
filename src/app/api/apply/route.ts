import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = (() => {
  const p = process.env.PROJECT_PATH;
  return p ? path.resolve(p) : process.cwd();
})();

interface ApplyChange {
  name: string;
  action: "created" | "modified" | "deleted";
  originalContent?: string;
  updatedContent?: string;
}

interface ApplyResult {
  file: string;
  ok: boolean;
  error?: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { changes: ApplyChange[] };
  const { changes } = body;

  if (!Array.isArray(changes) || changes.length === 0) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const results: ApplyResult[] = [];

  for (const change of changes) {
    const abs = path.resolve(PROJECT_ROOT, change.name);

    // Security: prevent path traversal
    if (!abs.startsWith(PROJECT_ROOT + path.sep) && abs !== PROJECT_ROOT) {
      results.push({ file: change.name, ok: false, error: "Path traversal denied" });
      continue;
    }

    try {
      if (change.action === "deleted") {
        fs.unlinkSync(abs);
        results.push({ file: change.name, ok: true });

      } else if (change.action === "created") {
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, change.updatedContent ?? "", "utf-8");
        results.push({ file: change.name, ok: true });

      } else if (change.action === "modified") {
        const current = fs.readFileSync(abs, "utf-8");

        if (change.originalContent) {
          if (!current.includes(change.originalContent)) {
            results.push({
              file: change.name,
              ok: false,
              error: "Could not locate the original snippet — file may have changed since the diff was generated.",
            });
            continue;
          }
          // Replace ONLY the first occurrence to be surgical
          const updated = current.replace(change.originalContent, change.updatedContent ?? "");
          fs.writeFileSync(abs, updated, "utf-8");
        } else {
          // No original snippet — write the full updated content
          fs.writeFileSync(abs, change.updatedContent ?? "", "utf-8");
        }
        results.push({ file: change.name, ok: true });
      }
    } catch (err) {
      results.push({ file: change.name, ok: false, error: (err as Error).message });
    }
  }

  return NextResponse.json({ results });
}
