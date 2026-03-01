"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown, Check, Plus, Paperclip, ImagePlus, Camera, FolderUp,
  Code2, Globe, Mic, MicOff, Send, X, Paintbrush, Terminal, Wand2,
  Command,
} from "lucide-react";
import type { GenieModel, Attachment } from "../lib/types";
import { MODELS, SLASH_CMDS, cn } from "../lib/types";
import { TierIcon, Waveform } from "./Primitives";

/* ------------------------------------------------------------------ */
/*  Model Selector                                                    */
/* ------------------------------------------------------------------ */
export function ModelSelector({ selected, onSelect }: {
  selected: GenieModel; onSelect: (m: GenieModel) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button className="g-model-btn" onClick={() => setOpen(!open)}>
        <span style={{ color: selected.tier === "fast" ? "var(--amber)" : selected.tier === "pro" ? "var(--p-light)" : "var(--cyan)" }}>
          <TierIcon tier={selected.tier} />
        </span>
        <span>{selected.label}</span>
        <ChevronDown size={10} style={{ color: "var(--text-2)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div className="g-glass-2 a-up" style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: 285, zIndex: 50,
            borderRadius: "var(--r-xl)", overflow: "hidden",
          }}>
            <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>Select Model</p>
            </div>
            {MODELS.map((m) => {
              const isActive = selected.id === m.id;
              const tierColor = m.tier === "fast" ? "var(--amber)" : m.tier === "pro" ? "var(--p-light)" : "var(--cyan)";
              const tierGlow = m.tier === "fast" ? "var(--amber-glow)" : m.tier === "pro" ? "var(--p-glow-2)" : "var(--cyan-glow)";
              return (
                <button key={m.id} onClick={() => { onSelect(m); setOpen(false); }} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px",
                  background: isActive ? "rgba(124,92,255,0.06)" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "var(--font)", textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                  <div style={{ width: 34, height: 34, borderRadius: "var(--r)", background: isActive ? tierGlow : "var(--surface-2)", border: `1px solid ${isActive ? "rgba(124,92,255,0.2)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                    <span style={{ color: tierColor }}><TierIcon tier={m.tier} /></span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? tierColor : "var(--text)" }}>{m.label}</span>
                      {m.badge && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "var(--p-glow-2)", color: "var(--p-light)", fontWeight: 700, letterSpacing: "0.06em" }}>{m.badge}</span>}
                      {isActive && <Check size={11} style={{ color: tierColor, marginLeft: "auto" }} />}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: "var(--text-2)" }}>{m.tagline}</span>
                    </div>
                  </div>
                </button>
              );
            })}
            <div style={{ padding: "6px 14px 8px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
              <p style={{ fontSize: 9.5, color: "var(--text-2)" }}>Powered by Claude · Anthropic</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Input Box                                                         */
/* ------------------------------------------------------------------ */
export function InputBox({
  input, setInput, onSend, isLoading, onStop, isRecording, onToggleRecording,
  attachments, setAttachments, onPaletteOpen, focused, setFocused,
}: {
  input: string; setInput: (v: string) => void;
  onSend: (t?: string) => void; isLoading: boolean;
  onStop: () => void; isRecording: boolean; onToggleRecording: () => void;
  attachments: Attachment[]; setAttachments: (a: Attachment[]) => void;
  onPaletteOpen: () => void; focused: boolean; setFocused: (v: boolean) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");

  const filteredCmds = SLASH_CMDS.filter((c) =>
    c.command.includes(slashFilter.toLowerCase()) || c.label.toLowerCase().includes(slashFilter.toLowerCase())
  );

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = `${Math.min(ta.scrollHeight, 148)}px`; }
  }, [input]);

  useEffect(() => {
    if (!showAttachMenu) return;
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showAttachMenu]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setShowSlashMenu(val.startsWith("/"));
    setSlashFilter(val.startsWith("/") ? val : "");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
    if (e.key === "Escape") setShowSlashMenu(false);
  };

  const addAttachment = (type: "file" | "image", name?: string) => {
    setAttachments([...attachments, { id: `${Date.now()}`, name: name ?? (type === "image" ? "screenshot.png" : "document.pdf"), type }]);
    setShowAttachMenu(false);
  };

  const focusTextarea = useCallback(() => { textareaRef.current?.focus(); }, []);

  const attachItems = [
    { icon: Paperclip, label: "File", desc: "PDF, DOC, TXT…", action: () => addAttachment("file") },
    { icon: ImagePlus, label: "Image", desc: "PNG, JPG, SVG…", action: () => addAttachment("image") },
    { icon: Camera, label: "Screenshot", desc: "Capture screen", action: () => addAttachment("image", "screenshot.png") },
    { icon: FolderUp, label: "Folder / ZIP", desc: "Upload project", action: () => addAttachment("file", "project.zip") },
    { icon: Code2, label: "Code Snippet", desc: "Paste block", action: () => { setShowAttachMenu(false); setInput(input + "\n```\n\n```"); focusTextarea(); } },
    { icon: Globe, label: "URL", desc: "Import from link", action: () => { setShowAttachMenu(false); setInput(input + " URL: "); focusTextarea(); } },
  ];

  const stateClass = isLoading ? "loading" : focused ? "focused" : "";
  const canSend = (input.trim().length > 0 || attachments.length > 0) && !isLoading;

  return (
    <div className={cn("g-input-wrap", stateClass)}>
      {/* Slash menu */}
      {showSlashMenu && filteredCmds.length > 0 && (
        <div className="g-glass-2 a-up" style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0,
          borderRadius: "var(--r-xl)", overflow: "hidden", zIndex: 50,
        }}>
          <p style={{ padding: "8px 14px 6px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>Commands</p>
          <div className="g-scroll" style={{ maxHeight: 220, overflowY: "auto" }}>
            {filteredCmds.map((cmd) => (
              <button key={cmd.command} onMouseDown={(e) => { e.preventDefault(); setInput(cmd.command + " "); setShowSlashMenu(false); focusTextarea(); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font)", textAlign: "left", transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,92,255,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--p-light)", minWidth: 72 }}>{cmd.command}</span>
                <span style={{ fontSize: 12.5, color: "var(--text)" }}>{cmd.label}</span>
                <span style={{ fontSize: 11, color: "var(--text-2)", marginLeft: 4 }}>— {cmd.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Textarea */}
      <div style={{ padding: "14px 16px 8px", position: "relative", zIndex: 1 }}>
        {isRecording ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 44 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", boxShadow: "0 0 8px var(--red-glow)", animation: "g-pulse 1s ease infinite" }} />
            <Waveform />
            <span style={{ fontSize: 12, color: "var(--red)", fontFamily: "var(--mono)" }}>Recording…</span>
          </div>
        ) : (
          <textarea ref={textareaRef} value={input} onChange={handleChange} onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setTimeout(() => setShowSlashMenu(false), 150); }}
            placeholder="Ask Genie anything about your product…  ( / for commands )"
            rows={1} className="g-textarea" style={{ minHeight: 44, maxHeight: 148 }} />
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px 10px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Attach */}
          <div ref={attachMenuRef} style={{ position: "relative" }}>
            <button className={cn("g-icon-btn", showAttachMenu ? "active" : "")} onClick={() => setShowAttachMenu(!showAttachMenu)}>
              <Plus size={16} style={{ transition: "transform 0.2s", transform: showAttachMenu ? "rotate(45deg)" : "none" }} />
            </button>
            {showAttachMenu && (
              <div className="g-glass-2 a-up" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: 240, zIndex: 200, borderRadius: "var(--r-xl)", overflow: "hidden", padding: "6px 0", boxShadow: "var(--shadow-lg)" }}>
                {attachItems.map((item) => (
                  <button key={item.label} onClick={item.action} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font)", textAlign: "left", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,92,255,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ width: 32, height: 32, borderRadius: "var(--r)", background: "rgba(124,92,255,0.1)", border: "1px solid rgba(124,92,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.icon size={14} style={{ color: "var(--p-light)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "var(--text-2)", marginTop: 1 }}>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 1, height: 16, background: "var(--border-2)", margin: "0 4px" }} />
          <button className="g-icon-btn g-tooltip" data-tip="Draw / annotate"><Paintbrush size={14} /></button>
          <button className="g-icon-btn g-tooltip" data-tip="Run in terminal"><Terminal size={14} /></button>
          <button className="g-icon-btn g-tooltip" data-tip="Magic rewrite"><Wand2 size={14} /></button>
          <button className="g-icon-btn g-tooltip" data-tip="Command palette (⌘K)" onClick={onPaletteOpen}>
            <Command size={14} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {/* Voice */}
          <button onClick={onToggleRecording} className={cn("g-icon-btn", isRecording ? "" : "")}
            style={isRecording ? { color: "var(--red)", background: "var(--red-glow)" } : {}}>
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          {/* Stop / Send */}
          {isLoading ? (
            <button onClick={onStop} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: "var(--r)", background: "rgba(255,77,106,0.1)",
              border: "1px solid rgba(255,77,106,0.25)", cursor: "pointer", color: "var(--red)",
              transition: "all 0.15s",
            }}>
              <X size={14} />
            </button>
          ) : (
            <button onClick={() => onSend()} disabled={!canSend} className="g-btn-send" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: "var(--r)",
              opacity: canSend ? 1 : 0.35, transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
            }}>
              <Send size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}