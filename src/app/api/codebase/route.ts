import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = (() => {
  const p = process.env.PROJECT_PATH;
  return p ? path.resolve(p) : process.cwd();
})();

const MAX_FILE_SIZE = 150 * 1024; // 150 KB

const IGNORE_DIRS = new Set([
  ".git", "node_modules", ".next", "dist", "build", "out", ".turbo",
  "__pycache__", ".venv", "venv", ".cache", "coverage", ".nyc_output",
]);

const IGNORE_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".bmp",
  ".mp4", ".mp3", ".wav", ".pdf", ".zip", ".gz", ".tar", ".lock",
  ".woff", ".woff2", ".ttf", ".eot",
]);

function walk(dir: string, base: string): string[] {
  const result: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return result;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || IGNORE_DIRS.has(entry.name)) continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      result.push(...walk(path.join(dir, entry.name), rel));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!IGNORE_EXT.has(ext)) result.push(rel);
    }
  }
  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");

  if (filePath) {
    const abs = path.resolve(PROJECT_ROOT, filePath);
    if (!abs.startsWith(PROJECT_ROOT + path.sep) && abs !== PROJECT_ROOT) {
      return NextResponse.json({ error: "Path traversal denied" }, { status: 400 });
    }
    try {
      const stat = fs.statSync(abs);
      if (stat.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File too large (> 150 KB)" }, { status: 413 });
      }
      const content = fs.readFileSync(abs, "utf-8");
      const lines = content.split("\n").length;
      return NextResponse.json({ path: filePath, content, lines });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  }

  // Return full file tree
  const files = walk(PROJECT_ROOT, "");
  return NextResponse.json({ files, root: PROJECT_ROOT });
}
