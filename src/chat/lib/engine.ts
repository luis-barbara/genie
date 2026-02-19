import type { FileChange, FileDiffLine } from "./types";

// ── XML block parser ────────────────────────────────────────────────
const CHANGE_RE =
  /<genie_change\s+file="([^"]+)"\s+action="(created|modified|deleted)"\s*(?:\/>|>([\s\S]*?)<\/genie_change>)/g;

const ORIGINAL_RE = /<original>([\s\S]*?)<\/original>/;
const UPDATED_RE  = /<updated>([\s\S]*?)<\/updated>/;
const CONTENT_RE  = /<content>([\s\S]*?)<\/content>/;

/**
 * Parses all <genie_change> blocks from an AI response and
 * returns an array of FileChange objects ready for the UI.
 */
export function parseFileChanges(text: string): FileChange[] {
  const changes: FileChange[] = [];

  for (const match of text.matchAll(CHANGE_RE)) {
    const [, file, action, inner = ""] = match;

    if (action === "deleted") {
      changes.push({ name: file, action: "deleted", approved: null });
      continue;
    }

    if (action === "created") {
      const m = CONTENT_RE.exec(inner);
      const content = m ? m[1].replace(/^\n/, "").replace(/\n$/, "") : "";
      changes.push({
        name: file,
        action: "created",
        approved: null,
        updatedContent: content,
        linesAdded: content ? content.split("\n").length : 0,
        diff: content.split("\n").map((l) => ({ content: l, type: "added" as const })),
      });
      continue;
    }

    if (action === "modified") {
      const om = ORIGINAL_RE.exec(inner);
      const um = UPDATED_RE.exec(inner);
      const original = om ? om[1].replace(/^\n/, "").replace(/\n$/, "") : "";
      const updated  = um ? um[1].replace(/^\n/, "").replace(/\n$/, "") : "";
      const diff = buildLineDiff(original, updated);
      changes.push({
        name: file,
        action: "modified",
        approved: null,
        originalContent: original,
        updatedContent: updated,
        linesAdded:   diff.filter((l) => l.type === "added").length,
        linesRemoved: diff.filter((l) => l.type === "removed").length,
        diff,
      });
    }
  }

  return changes;
}

/**
 * Removes all <genie_change> blocks from the displayed text so the
 * chat bubble shows only the human-readable explanation.
 */
export function stripFileChanges(text: string): string {
  return text
    .replace(/<genie_change[\s\S]*?(?:\/>|<\/genie_change>)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── LCS-based line diff ─────────────────────────────────────────────
const CONTEXT = 3; // lines of context around each change hunk

export function buildLineDiff(original: string, updated: string): FileDiffLine[] {
  if (original === updated) {
    return original.split("\n").map((l) => ({ content: l, type: "context" as const }));
  }

  const oldLines = original.split("\n");
  const newLines = updated.split("\n");
  const m = oldLines.length;
  const n = newLines.length;

  // Guard: very large files get a simple "replaced" view
  if (m * n > 250_000) {
    return [
      ...oldLines.map((l) => ({ content: l, type: "removed" as const })),
      ...newLines.map((l) => ({ content: l, type: "added"   as const })),
    ];
  }

  // DP table for LCS
  const dp: Uint32Array[] = [];
  for (let i = 0; i <= m; i++) dp[i] = new Uint32Array(n + 1);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        oldLines[i - 1] === newLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Trace back
  const ops: FileDiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      ops.unshift({ content: oldLines[i - 1], type: "context" });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ content: newLines[j - 1], type: "added" });
      j--;
    } else {
      ops.unshift({ content: oldLines[i - 1], type: "removed" });
      i--;
    }
  }

  // Trim context: only keep CONTEXT lines around each change
  const keep = new Uint8Array(ops.length);
  for (let k = 0; k < ops.length; k++) {
    if (ops[k].type !== "context") {
      const lo = Math.max(0, k - CONTEXT);
      const hi = Math.min(ops.length - 1, k + CONTEXT);
      for (let x = lo; x <= hi; x++) keep[x] = 1;
    }
  }

  return ops.filter((_, k) => keep[k]);
}
