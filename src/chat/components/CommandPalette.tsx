"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search, Wrench, Globe, Zap, Terminal, Eye, Undo2,
  Plus, Archive, Settings,
  FileCode, Braces, Hash, ArrowUpRight,
} from "lucide-react";
import { SLASH_CMDS } from "../lib/types";

interface PaletteAction {
  id: string; label: string; description: string; group: string;
  icon: React.ElementType; shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  onNewConv: () => void;
}

const ICONS: Record<string, React.ElementType> = {
  "/fix": Wrench, "/deploy": Globe, "/optimize": Zap, "/test": Terminal,
  "/status": Eye, "/rollback": Undo2, "/search": Search, "/explain": FileCode,
  "/refactor": Braces, "/docs": Hash, "/review": Braces,
};

export function CommandPalette({ open, onClose, onSend, onNewConv }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allActions: PaletteAction[] = [
    { id: "new-conv", label: "New Conversation", description: "Start a fresh chat", group: "Chat", icon: Plus, shortcut: "⌘N", action: () => { onNewConv(); onClose(); } },
    ...SLASH_CMDS.map((cmd) => ({
      id: cmd.command, label: cmd.label, description: cmd.description,
      group: "Commands", icon: ICONS[cmd.command] ?? Terminal,
      action: () => { onSend(cmd.command + " "); onClose(); },
    })),
    { id: "archive", label: "Archive Conversation", description: "Archive current chat", group: "Manage", icon: Archive, action: () => { onClose(); } },
    { id: "settings", label: "Settings", description: "Open preferences", group: "App", icon: Settings, shortcut: "⌘,", action: () => { onClose(); } },
  ];

  const filtered = query.trim()
    ? allActions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.id.toLowerCase().includes(query.toLowerCase())
      )
    : allActions;

  const groups = Array.from(new Set(filtered.map((a) => a.group)));

  useEffect(() => {
    if (open) { setQuery(""); setFocused(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setFocused((p) => Math.min(p + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setFocused((p) => Math.max(p - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); filtered[focused]?.action(); }
      if (e.key === "Escape")    { onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, focused, filtered, onClose]);

  useEffect(() => {
    const el = listRef.current?.children[focused] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [focused]);

  if (!open) return null;

  let globalIdx = -1;

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={onClose} />

      {/* Panel */}
      <div className="g-palette a-scale" style={{
        position: "fixed", top: "18%", left: "50%", transform: "translateX(-50%)",
        width: "min(560px, 90vw)", zIndex: 201, overflow: "hidden",
      }}>
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <Search size={15} style={{ color: "var(--text-3)", flexShrink: 0 }} />
          <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
            placeholder="Search commands or type anything…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14.5, color: "var(--text)", fontFamily: "var(--font)", caretColor: "var(--p-light)" }}
          />
          <kbd style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 5, background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-3)", fontFamily: "var(--mono)" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="g-scroll" style={{ maxHeight: 360, overflowY: "auto", padding: "6px 0" }}>
          {groups.map((group) => (
            <div key={group}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", padding: "8px 16px 4px" }}>{group}</p>
              {filtered.filter((a) => a.group === group).map((action) => {
                globalIdx++;
                const idx = globalIdx;
                const isFocused = focused === idx;
                return (
                  <button key={action.id} onMouseEnter={() => setFocused(idx)} onClick={action.action}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "9px 16px",
                      background: isFocused ? "rgba(124,92,255,0.1)" : "transparent",
                      border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font)",
                      transition: "background 0.1s",
                    }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "var(--r-sm)", flexShrink: 0,
                      background: isFocused ? "var(--p-glow)" : "var(--surface-2)",
                      border: `1px solid ${isFocused ? "rgba(124,92,255,0.3)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      <action.icon size={13} style={{ color: isFocused ? "var(--p-light)" : "var(--text-3)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: isFocused ? "var(--text)" : "var(--text)" }}>{action.label}</span>
                      <p style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 1 }}>{action.description}</p>
                    </div>
                    {action.shortcut && (
                      <kbd style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-3)", fontFamily: "var(--mono)", flexShrink: 0 }}>
                        {action.shortcut}
                      </kbd>
                    )}
                    {isFocused && <ArrowUpRight size={12} style={{ color: "var(--text-3)", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>No results for &ldquo;{query}&rdquo;</p>
              <button onClick={() => { onSend(query); onClose(); }} style={{
                marginTop: 10, padding: "7px 16px", borderRadius: "var(--r-full)",
                background: "var(--p-glow-2)", border: "1px solid rgba(124,92,255,0.3)",
                color: "var(--p-light)", fontSize: 12.5, cursor: "pointer", fontFamily: "var(--font)",
              }}>Send as message →</button>
            </div>
          )}
        </div>

        <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          {[["↑↓", "navigate"], ["↵", "select"], ["esc", "close"]].map(([key, desc]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-3)", fontFamily: "var(--mono)" }}>{key}</kbd>
              <span style={{ fontSize: 10.5, color: "var(--text-3)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}