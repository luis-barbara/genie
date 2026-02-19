import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const PROJECT_ROOT = (() => {
  const p = process.env.PROJECT_PATH;
  return p ? path.resolve(p) : process.cwd();
})();

const IGNORE_DIRS = new Set([
  ".git", "node_modules", ".next", "dist", "build", "out", ".turbo",
  "__pycache__", ".venv", "venv", ".cache", "coverage",
]);

const IGNORE_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".bmp",
  ".mp4", ".mp3", ".wav", ".pdf", ".zip", ".gz", ".tar", ".lock",
  ".woff", ".woff2", ".ttf", ".eot",
]);

function walk(dir: string, base: string): string[] {
  const result: string[] = [];
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return result; }
  for (const e of entries) {
    if (e.name.startsWith(".") || IGNORE_DIRS.has(e.name)) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) result.push(...walk(path.join(dir, e.name), rel));
    else if (!IGNORE_EXT.has(path.extname(e.name).toLowerCase())) result.push(rel);
  }
  return result;
}

// ── Anthropic tool definitions ──────────────────────────────────────
const TOOLS = [
  {
    name: "list_files",
    description: "List all source files in the connected project. Returns an array of relative paths.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "read_file",
    description: "Read the full content of a specific file in the project.",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Relative path to the file, e.g. src/app/page.tsx" },
      },
      required: ["path"],
    },
  },
];

// ── Types for Anthropic responses ───────────────────────────────────
interface TextBlock    { type: "text"; text: string }
interface ToolUseBlock { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
type ContentBlock = TextBlock | ToolUseBlock;

interface AnthropicMsg {
  id: string; type: string; role: "assistant";
  content: ContentBlock[];
  stop_reason: "end_turn" | "tool_use" | "max_tokens";
  usage: { input_tokens: number; output_tokens: number };
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[] | Array<{ type: string; tool_use_id?: string; content?: string; is_error?: boolean }>;
}

// ── Non-streaming tool-use loop ─────────────────────────────────────
async function runToolLoop(
  messages: ApiMessage[],
  system: string,
  model: string,
  maxTokens: number,
  apiKey: string,
): Promise<{
  finalMessages: ApiMessage[];
  fileReads: { file: string; lines: number }[];
  inputTokens: number;
  error?: { message: string };
}> {
  const loopMsgs = [...messages];
  const fileReads: { file: string; lines: number }[] = [];
  let inputTokens = 0;

  for (let iter = 0; iter < 8; iter++) {
    const res = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: loopMsgs, tools: TOOLS }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
      return { finalMessages: loopMsgs, fileReads, inputTokens, error: { message: errBody?.error?.message ?? `API error ${res.status}` } };
    }

    const data = await res.json() as AnthropicMsg;
    inputTokens += data.usage.input_tokens;

    if (data.stop_reason !== "tool_use") {
      // Done — push the final assistant message so the caller can stream from here
      loopMsgs.push({ role: "assistant", content: data.content });
      return { finalMessages: loopMsgs, fileReads, inputTokens };
    }

    // Handle tool calls
    const toolBlocks = data.content.filter((b): b is ToolUseBlock => b.type === "tool_use");
    loopMsgs.push({ role: "assistant", content: data.content });

    const toolResults: Array<{ type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean }> = [];

    for (const tb of toolBlocks) {
      if (tb.name === "list_files") {
        const files = walk(PROJECT_ROOT, "");
        toolResults.push({ type: "tool_result", tool_use_id: tb.id, content: JSON.stringify({ files }) });

      } else if (tb.name === "read_file") {
        const filePath = (tb.input as { path?: string }).path ?? "";
        try {
          const abs = path.resolve(PROJECT_ROOT, filePath);
          if (!abs.startsWith(PROJECT_ROOT)) throw new Error("Path traversal denied");
          const content = fs.readFileSync(abs, "utf-8");
          const lines = content.split("\n").length;
          fileReads.push({ file: filePath, lines });
          toolResults.push({ type: "tool_result", tool_use_id: tb.id, content: JSON.stringify({ content, lines }) });
        } catch (err) {
          toolResults.push({ type: "tool_result", tool_use_id: tb.id, content: JSON.stringify({ error: (err as Error).message }), is_error: true });
        }
      }
    }

    loopMsgs.push({ role: "user", content: toolResults });
  }

  return { finalMessages: loopMsgs, fileReads, inputTokens, error: { message: "Tool-use loop limit reached without a final response." } };
}

// ── Route handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: { message: "ANTHROPIC_KEY not configured on server." } }, { status: 500 });
  }

  let rawBody: Record<string, unknown>;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid JSON body." } }, { status: 400 });
  }

  const { enableCodeEngine, ...anthropicBody } = rawBody as Record<string, unknown> & { enableCodeEngine?: boolean };

  // ── Simple proxy (no code engine) ──────────────────────────────
  if (!enableCodeEngine) {
    let upstream: Response;
    try {
      upstream = await fetch(ANTHROPIC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(anthropicBody),
        // @ts-expect-error — Node 18+ fetch duplex
        duplex: "half",
      });
    } catch (err) {
      return NextResponse.json({ error: { message: err instanceof Error ? err.message : "Upstream fetch failed" } }, { status: 502 });
    }
    const retryAfter = upstream.headers.get("retry-after");
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no",
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    });
  }

  // ── Code engine mode: tool-use loop → stream ────────────────────
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const enc = new TextEncoder();

  const emit = (eventName: string, data: unknown) =>
    writer.write(enc.encode(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`));

  (async () => {
    try {
      const { messages, system, model, max_tokens } = anthropicBody as {
        messages: ApiMessage[]; system: string; model: string; max_tokens: number;
      };

      // 1. Run tool-use loop
      const { finalMessages, fileReads, error } = await runToolLoop(
        messages, system, model, max_tokens ?? 4096, apiKey,
      );

      if (error) {
        await emit("x-error", error);
        return;
      }

      // 2. Emit file-read events
      for (const fr of fileReads) {
        await emit("x-file-read", fr);
      }

      // 3. The last message in finalMessages is the assistant's final response (non-streaming).
      //    We already have the text — re-emit it as fake SSE chunks.
      const lastMsg = finalMessages[finalMessages.length - 1];
      if (lastMsg?.role === "assistant" && Array.isArray(lastMsg.content)) {
        const textBlocks = (lastMsg.content as ContentBlock[]).filter((b): b is TextBlock => b.type === "text");
        const fullText = textBlocks.map((b) => b.text).join("");

        // Imitate message_start
        await writer.write(enc.encode(
          `data: ${JSON.stringify({ type: "message_start", message: { usage: { input_tokens: 0 } } })}\n\n`
        ));

        // Stream in chunks of ~80 chars to keep the UI responsive
        const CHUNK = 80;
        for (let pos = 0; pos < fullText.length; pos += CHUNK) {
          await writer.write(enc.encode(
            `data: ${JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text: fullText.slice(pos, pos + CHUNK) } })}\n\n`
          ));
        }

        // Imitate message_delta with output token count
        const outputTokens = Math.ceil(fullText.length / 4); // rough estimate
        await writer.write(enc.encode(
          `data: ${JSON.stringify({ type: "message_delta", usage: { output_tokens: outputTokens } })}\n\n`
        ));
      }

    } catch (err) {
      await emit("x-error", { message: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      await writer.close();
    }
  })();

  return new NextResponse(readable as unknown as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
