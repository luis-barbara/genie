"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

// ── Language metadata ──────────────────────────────────────────────
const LANG_META: Record<string, { label: string; color: string }> = {
  typescript: { label: "TypeScript", color: "#3b82f6" },
  javascript: { label: "JavaScript", color: "#f59e0b" },
  tsx:        { label: "TSX",        color: "#06b6d4" },
  jsx:        { label: "JSX",        color: "#f97316" },
  python:     { label: "Python",     color: "#a78bfa" },
  rust:       { label: "Rust",       color: "#f97316" },
  go:         { label: "Go",         color: "#06b6d4" },
  css:        { label: "CSS",        color: "#ec4899" },
  html:       { label: "HTML",       color: "#f97316" },
  json:       { label: "JSON",       color: "#34d399" },
  sql:        { label: "SQL",        color: "#60a5fa" },
  bash:       { label: "Shell",      color: "#a3e635" },
  sh:         { label: "Shell",      color: "#a3e635" },
  yaml:       { label: "YAML",       color: "#fbbf24" },
  md:         { label: "Markdown",   color: "#94a3b8" },
  markdown:   { label: "Markdown",   color: "#94a3b8" },
};

// Supported by shiki (subset we care about)
const SHIKI_LANGS = new Set([
  "typescript","javascript","tsx","jsx","python","rust","go","css","html",
  "json","sql","bash","sh","yaml","markdown","md","c","cpp","java","swift",
  "kotlin","ruby","php","graphql","toml","dockerfile","prisma","terraform",
  "vue","svelte","astro","mdx","xml","nginx","regex",
]);

// Module-level cache to avoid re-highlighting the same code
const cache = new Map<string, string>();

async function highlight(code: string, lang: string): Promise<string> {
  const key = `${lang}\x00${code}`;
  if (cache.has(key)) return cache.get(key)!;

  const effectiveLang = SHIKI_LANGS.has(lang) ? lang : "text";
  try {
    const full = await codeToHtml(code, {
      lang: effectiveLang,
      theme: "github-dark-default",
    });
    // shiki wraps output in <pre><code>…</code></pre>
    // Extract just the inner content so we can apply our own wrapper styles
    const match = full.match(/<code[^>]*>([\s\S]*)<\/code>/);
    const inner = match ? match[1] : escapeHtml(code);
    cache.set(key, inner);
    return inner;
  } catch {
    const fallback = escapeHtml(code);
    cache.set(key, fallback);
    return fallback;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ── Component ──────────────────────────────────────────────────────
interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "text", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const pendingKey = useRef<string>("");

  const lang = language.toLowerCase().replace(/^language-/, "");
  const meta = LANG_META[lang];

  useEffect(() => {
    const key = `${lang}\x00${code}`;
    pendingKey.current = key;
    highlight(code.trim(), lang).then((html) => {
      if (pendingKey.current === key) setHighlighted(html);
    });
  }, [code, lang]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div style={{
      margin: "12px 0", borderRadius: "var(--r-lg)", overflow: "hidden",
      background: "rgba(0,0,0,0.45)", border: "1px solid var(--border-2)",
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "7px 14px", borderBottom: "1px solid var(--border)",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* macOS traffic lights */}
          <div style={{ display: "flex", gap: 5 }}>
            {["#ff5f57","#ffbd2e","#28c840"].map((c, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
          {filename && (
            <span style={{ fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--text-2)" }}>{filename}</span>
          )}
          {!filename && meta && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color }} />
              <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text-3)" }}>{meta.label}</span>
            </div>
          )}
          {!filename && !meta && lang !== "text" && (
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text-3)" }}>{lang}</span>
          )}
        </div>
        <button onClick={copy} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 9px", borderRadius: "var(--r-sm)",
          background: copied ? "rgba(0,229,160,0.1)" : "transparent",
          border: `1px solid ${copied ? "rgba(0,229,160,0.2)" : "var(--border)"}`,
          color: copied ? "var(--green)" : "var(--text-3)", fontSize: 11,
          cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
        }}>
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code — show plain until shiki resolves */}
      <div style={{ overflowX: "auto", padding: "14px 18px" }} className="g-scroll">
        <pre style={{
          margin: 0, fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7,
          color: "var(--text-2)",
          // shiki sets individual span colours; remove shiki's bg so ours shows
        }}>
          {highlighted !== null
            ? <code
                className="g-shiki"
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            : <code style={{ color: "var(--text-3)" }}>{code.trim()}</code>
          }
        </pre>
      </div>
    </div>
  );
}
