"use client";
import { useRef, useCallback } from "react";
import type { ApiMessage } from "../lib/types";

const STREAM_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 1;

function makeLinkedAbort(parentSignal: AbortSignal): [AbortController, () => void] {
  const ctrl = new AbortController();
  const onParentAbort = () => ctrl.abort();
  parentSignal.addEventListener("abort", onParentAbort, { once: true });
  return [ctrl, () => parentSignal.removeEventListener("abort", onParentAbort)];
}

export interface StreamOptions {
  messages: ApiMessage[];
  system: string;
  model: string;
  enableCodeEngine?: boolean;
  onChunk: (text: string) => void;
  onFileRead?: (file: string, lines: number) => void;
  onDone: (inputTokens: number, outputTokens: number) => void;
  onError: (err: string) => void;
}

export function useClaudeStream() {
  const userAbortRef = useRef<AbortController | null>(null);

  const stream = useCallback(async (opts: StreamOptions, _retries = 0) => {
    userAbortRef.current?.abort();
    userAbortRef.current = new AbortController();
    const userSignal = userAbortRef.current.signal;

    const [ctrl, cleanupSignal] = makeLinkedAbort(userSignal);
    const { messages, system, model, enableCodeEngine, onChunk, onFileRead, onDone, onError } = opts;

    // Silence watchdog — resets on every chunk received
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    const resetTimer = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        ctrl.abort();
        onError("No response from model after 30 s. Check your connection and try again.");
      }, STREAM_TIMEOUT_MS);
    };
    resetTimer();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, max_tokens: 4096, stream: true, system, messages, enableCodeEngine: enableCodeEngine ?? false }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const retryAfter = res.headers.get("retry-after");

        // 429 / 529 — rate limited, retry once after the suggested delay
        if ((res.status === 429 || res.status === 529) && _retries < MAX_RETRIES) {
          const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5_000;
          onChunk(`\n\n_Rate-limited — retrying in ${Math.round(delay / 1000)} s…_\n\n`);
          await new Promise((r) => setTimeout(r, delay));
          if (userSignal.aborted) return;
          return stream(opts, _retries + 1);
        }

        const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
        if (res.status === 401) {
          onError("Invalid API key — check ANTHROPIC_KEY on the server.");
        } else {
          onError(body?.error?.message ?? `API error ${res.status}`);
        }
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { onError("No response body"); return; }

      const decoder = new TextDecoder();
      let buf = "", inputTokens = 0, outputTokens = 0, currentEvent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        resetTimer();
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop() ?? "";
        for (const line of lines) {
          // Track SSE event type
          if (line.startsWith("event: ")) { currentEvent = line.slice(7).trim(); continue; }
          if (line === "") { currentEvent = ""; continue; }
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          // Custom Genie events
          if (currentEvent === "x-file-read") {
            try { const fr = JSON.parse(raw) as { file: string; lines: number }; onFileRead?.(fr.file, fr.lines); } catch { /* skip */ }
            continue;
          }
          if (currentEvent === "x-error") {
            try { const e = JSON.parse(raw) as { message: string }; onError(e.message); } catch { onError("Unknown engine error"); }
            return;
          }
          // Normal Anthropic SSE
          if (raw === "[DONE]") continue;
          try {
            const ev = JSON.parse(raw) as {
              type: string;
              delta?: { type: string; text: string };
              usage?: { output_tokens: number };
              message?: { usage: { input_tokens: number } };
            };
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") onChunk(ev.delta.text);
            if (ev.type === "message_delta" && ev.usage) outputTokens = ev.usage.output_tokens ?? 0;
            if (ev.type === "message_start" && ev.message?.usage) inputTokens = ev.message.usage.input_tokens ?? 0;
          } catch { /* skip malformed SSE */ }
        }
      }
      onDone(inputTokens, outputTokens);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === "AbortError") return;
      onError((err as { message?: string })?.message ?? "Unknown error");
    } finally {
      if (silenceTimer) clearTimeout(silenceTimer);
      cleanupSignal();
    }
  }, []);

  const abort = useCallback(() => { userAbortRef.current?.abort(); }, []);

  return { stream, abort };
}
