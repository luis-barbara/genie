"use client";
import { memo, useState, useRef, useEffect } from "react";
import {
  Undo2, RefreshCw, ThumbsUp, ThumbsDown, Check,
  Cpu, AlertTriangle, Pencil, X, ExternalLink,
  Loader2, Braces, Copy,
} from "lucide-react";
import type { Message } from "../lib/types";
import { cn, timeAgo, formatTokens } from "../lib/types";
import { GenieAvatar, ThinkingBlock, FileReadBlock, CodeDiffBlock, DotLoader } from "./Primitives";
import { Prose } from "./Prose";

interface MessageBubbleProps {
  message: Message;
  onResolve: (ai: number, v: string | string[]) => void;
  onSend: (t: string) => void;
  onFileApprove: (fi: number) => void;
  onFileReject: (fi: number) => void;
  onRevert: () => void;
  onEdit: (newContent: string) => void;
  onRetry: () => void;
}

export const MessageBubble = memo(({
  message, onResolve, onSend, onFileApprove, onFileReject, onRevert, onEdit, onRetry,
}: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.style.height = "auto";
      editRef.current.style.height = editRef.current.scrollHeight + "px";
      editRef.current.setSelectionRange(editRef.current.value.length, editRef.current.value.length);
    }
  }, [editing]);

  const copy = () => { navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const submitEdit = () => { if (editValue.trim() && editValue !== message.content) onEdit(editValue.trim()); setEditing(false); };

  if (isSystem) {
    return (
      <div style={{ display: "flex", gap: 10, padding: "9px 14px", borderRadius: "var(--r-lg)", background: message.isError ? "rgba(255,77,106,0.06)" : "rgba(255,179,64,0.06)", border: `1px solid ${message.isError ? "rgba(255,77,106,0.15)" : "rgba(255,179,64,0.15)"}` }}>
        <AlertTriangle size={13} style={{ color: message.isError ? "var(--red)" : "var(--amber)", flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13, color: "var(--text)" }}>{message.content}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", opacity: message.isReverted ? 0.28 : 1, transition: "opacity 0.3s" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ maxWidth: isUser ? "76%" : "88%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 6 }}>

        {/* Sender */}
        {!isUser && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
            <GenieAvatar size={24} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.02em" }}>Genie</span>
            <span style={{ fontSize: 10.5, color: "var(--text-3)", opacity: 0.45 }}>{timeAgo(message.timestamp)}</span>
            {message.editedAt && <span style={{ fontSize: 10, color: "var(--text-3)", opacity: 0.35, fontStyle: "italic" }}>edited</span>}
          </div>
        )}

        {/* Attachments */}
        {message.attachments?.map((att) => (
          <div key={att.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: "var(--r)", background: "var(--surface-2)", border: "1px solid var(--border-2)", fontSize: 12 }}>
            {att.type === "image" && att.preview ? (
              <img src={att.preview} alt={att.name} style={{ width: 40, height: 40, borderRadius: 5, objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 14 }}>{att.type === "image" ? "🖼" : "📄"}</span>
            )}
            <span style={{ color: "var(--text-2)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
          </div>
        ))}

        {!isUser && message.fileReads && <FileReadBlock reads={message.fileReads} />}
        {!isUser && message.thinking && <ThinkingBlock thinking={message.thinking} />}

        {/* Bubble */}
        {(message.content || message.isStreaming) && (
          <>
            {isUser && editing ? (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                <textarea ref={editRef} value={editValue}
                  onChange={(e) => { setEditValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitEdit(); } if (e.key === "Escape") setEditing(false); }}
                  style={{ width: "100%", minHeight: 80, padding: "10px 14px", borderRadius: "var(--r-lg)", background: "rgba(124,92,255,0.08)", border: "1px solid rgba(124,92,255,0.35)", color: "var(--text)", fontFamily: "var(--font)", fontSize: 14.5, lineHeight: 1.65, outline: "none", resize: "none", caretColor: "var(--p-light)" }}
                />
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button onClick={() => setEditing(false)} style={{ padding: "5px 12px", borderRadius: "var(--r-full)", background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font)" }}>Cancel</button>
                  <button onClick={submitEdit} style={{ padding: "5px 12px", borderRadius: "var(--r-full)", background: "linear-gradient(135deg, var(--p-dark), var(--p))", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "var(--font)", boxShadow: "0 2px 8px rgba(124,92,255,0.25)" }}>
                    <Check size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />Save & resend
                  </button>
                </div>
              </div>
            ) : (
              <div className={isUser ? "g-user-bubble" : ""} style={{ padding: isUser ? "10px 15px" : "2px 0" }}>
                {isUser ? (
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--text)", whiteSpace: "pre-wrap" }}>{message.content}</p>
                ) : (
                  <Prose content={message.content} streaming={message.isStreaming} />
                )}
                {message.isStreaming && message.content.length === 0 && <DotLoader />}
              </div>
            )}
          </>
        )}

        {/* File changes */}
        {!isUser && message.fileChanges && message.fileChanges.length > 0 && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Braces size={11} style={{ color: "var(--text-3)" }} />
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>{message.fileChanges.length} file{message.fileChanges.length !== 1 ? "s" : ""} changed</span>
            </div>
            {message.fileChanges.map((fc, fi) => (
              <CodeDiffBlock key={fi} change={fc} onApprove={() => onFileApprove(fi)} onReject={() => onFileReject(fi)} />
            ))}
          </div>
        )}

        {/* Actions */}
        {message.actions?.map((action, ai) => (
          <div key={ai} style={{ width: "100%" }}>
            {action.type === "approval" && !action.resolved && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => onResolve(ai, "approved")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: "var(--r-full)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, var(--p-dark), var(--p))", color: "#fff", border: "none", fontFamily: "var(--font)", boxShadow: "0 2px 10px rgba(124,92,255,0.25)" }}><Check size={12} /> Approve</button>
                <button onClick={() => onResolve(ai, "rejected")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: "var(--r-full)", fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border-2)", fontFamily: "var(--font)" }}><X size={11} /> Reject</button>
              </div>
            )}
            {action.type === "approval" && action.resolved && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: "var(--r)", fontSize: 12, fontWeight: 500, color: action.resolved === "approved" ? "var(--green)" : "var(--red)", background: action.resolved === "approved" ? "var(--green-glow)" : "var(--red-glow)" }}>
                {action.resolved === "approved" ? <><Check size={11} /> Approved</> : <><X size={11} /> Rejected</>}
              </div>
            )}
            {action.type === "suggestions" && !action.resolved && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {action.suggestions?.map((s) => <button key={s} className="g-chip" onClick={() => { onResolve(ai, s); onSend(s); }}>{s}</button>)}
              </div>
            )}
            {action.type === "tasks" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {action.tasks?.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    {t.status === "done" && <Check size={12} style={{ color: "var(--green)" }} />}
                    {t.status === "in_progress" && <Loader2 size={12} className="a-spin" style={{ color: "var(--p-light)" }} />}
                    {t.status === "todo" && <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid var(--border-2)" }} />}
                    <span style={{ color: t.status === "done" ? "var(--text-3)" : "var(--text)", textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            )}
            {action.type === "links" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {action.links?.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: "var(--r)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--cyan)", fontSize: 12.5, background: "var(--cyan-glow)", textDecoration: "none" }}>
                    <ExternalLink size={11} /> {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Toolbar — assistant */}
        {!isUser && !message.isStreaming && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, minHeight: 26, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
            {message.tokenUsage && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginRight: 6, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text-3)" }}>
                <Cpu size={10} style={{ opacity: 0.6 }} />
                <span>{formatTokens(message.tokenUsage.totalTokens)}</span>
                <span style={{ opacity: 0.3 }}>·</span>
                <span>${(message.tokenUsage.costCents / 100).toFixed(4)}</span>
                {message.tokenUsage.tokensPerSecond && <><span style={{ opacity: 0.3 }}>·</span><span>{message.tokenUsage.tokensPerSecond}t/s</span></>}
              </div>
            )}
            <button className="g-icon-btn g-tooltip" data-tip="Revert" onClick={onRevert} style={{ padding: 5 }}><Undo2 size={11} /></button>
            <button className="g-icon-btn g-tooltip" data-tip={copied ? "Copied!" : "Copy"} onClick={copy} style={{ padding: 5 }}>{copied ? <Check size={11} style={{ color: "var(--green)" }} /> : <Copy size={11} />}</button>
            <button className="g-icon-btn g-tooltip" data-tip="Retry" onClick={onRetry} style={{ padding: 5 }}><RefreshCw size={11} /></button>
            <button className={cn("g-icon-btn g-tooltip", feedback === "up" ? "active" : "")} data-tip="Good" onClick={() => setFeedback(feedback === "up" ? null : "up")} style={{ padding: 5 }}><ThumbsUp size={11} /></button>
            <button className="g-icon-btn g-tooltip" data-tip="Bad" onClick={() => setFeedback(feedback === "down" ? null : "down")} style={{ padding: 5, ...(feedback === "down" ? { color: "var(--red)", background: "var(--red-glow)" } : {}) }}><ThumbsDown size={11} /></button>
          </div>
        )}

        {/* Toolbar — user */}
        {isUser && !editing && hovered && (
          <div style={{ display: "flex", gap: 2 }}>
            <button className="g-icon-btn g-tooltip" data-tip="Edit & resend" onClick={() => { setEditValue(message.content); setEditing(true); }} style={{ padding: 5 }}><Pencil size={11} /></button>
            <button className="g-icon-btn g-tooltip" data-tip={copied ? "Copied!" : "Copy"} onClick={copy} style={{ padding: 5 }}>{copied ? <Check size={11} style={{ color: "var(--green)" }} /> : <Copy size={11} />}</button>
          </div>
        )}

        {message.isReverted && (
          <span style={{ fontSize: 10.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 4, fontStyle: "italic" }}>
            <Undo2 size={10} /> Reverted
          </span>
        )}
      </div>
    </div>
  );
});
MessageBubble.displayName = "MessageBubble";