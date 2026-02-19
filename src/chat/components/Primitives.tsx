"use client";
import { memo, useState } from "react";
import {
  ChevronDown, Check, Loader2, Eye, FileCode,
  ChevronRight, FileText, X, Sparkles,
} from "lucide-react";
import type { GenieModel, FileReadActivity, FileChange, Message } from "../lib/types";

export const TierIcon = ({ tier }: { tier: GenieModel["tier"] }) => {
  if (tier === "fast") return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
  if (tier === "pro") return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>;
};

export const DotLoader = () => (
  <div className="g-dot-loader" style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 2px" }}>
    <span /><span /><span />
  </div>
);

export const GenieAvatar = ({ size = 26 }: { size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.31), flexShrink: 0,
    background: "linear-gradient(135deg, rgba(124,92,255,0.3), rgba(0,212,255,0.15))",
    border: "1px solid rgba(124,92,255,0.25)", display: "flex", alignItems: "center",
    justifyContent: "center", boxShadow: "0 0 10px rgba(124,92,255,0.18)",
  }}>
    <Sparkles size={Math.round(size * 0.44)} style={{ color: "var(--p-light)" }} />
  </div>
);

export const ContextBar = ({ used, max }: { used: number; max: number }) => {
  const pct = Math.min((used / (max * 1000)) * 100, 100);
  const color = pct > 85 ? "var(--red)" : pct > 65 ? "var(--amber)" : undefined;
  const label = pct > 85 ? "Context almost full" : pct > 65 ? "Context filling up" : undefined;
  return (
    <div className="g-tooltip" data-tip={label ?? `${Math.round(pct)}% context used`} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "default" }}>
      <div style={{ width: 90, height: 3, borderRadius: 3, background: "var(--surface-3)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3, width: `${pct}%`,
          background: color ?? "linear-gradient(90deg, var(--p), var(--cyan))",
          transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: color ?? "var(--text-3)", minWidth: 36 }}>
        {Math.round(used / 1000 * 10) / 10}k
      </span>
    </div>
  );
};

export const ThinkingBlock = memo(({ thinking }: { thinking: Message["thinking"] }) => {
  const [expanded, setExpanded] = useState(false);
  if (!thinking) return null;
  const allDone = thinking.steps.every((s) => s.status === "done");
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: "var(--r)", background: expanded ? "rgba(124,92,255,0.06)" : "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.15s", fontFamily: "var(--font)" }}>
        {allDone ? <Sparkles size={12} style={{ color: "var(--p-light)", flexShrink: 0 }} /> : <Loader2 size={12} style={{ color: "var(--p-light)" }} className="a-spin" />}
        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--text-2)" }}>
          {allDone ? "Reasoned" : "Reasoning…"}
          {allDone && thinking.duration && <span style={{ color: "var(--text-3)", fontWeight: 400, marginLeft: 8 }}>· {thinking.duration}</span>}
        </span>
        <ChevronDown size={11} style={{ color: "var(--text-3)", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>
      {expanded && (
        <div className="g-thinking-line" style={{ marginTop: 8 }}>
          {thinking.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ marginTop: 3, flexShrink: 0 }}>
                {step.status === "done" && <Check size={12} style={{ color: "var(--green)" }} />}
                {step.status === "in_progress" && <Loader2 size={12} className="a-spin" style={{ color: "var(--p-light)" }} />}
                {step.status === "pending" && <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid var(--border-2)" }} />}
              </div>
              <div>
                <p style={{ fontSize: 12.5, color: step.status === "done" ? "var(--text-2)" : "var(--text)" }}>{step.label}</p>
                {step.detail && <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, fontFamily: "var(--mono)" }}>{step.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
ThinkingBlock.displayName = "ThinkingBlock";

export const FileReadBlock = memo(({ reads }: { reads: FileReadActivity[] }) => {
  const [expanded, setExpanded] = useState(false);
  const done = reads.filter((r) => r.status === "done").length;
  const loading = reads.some((r) => r.status === "reading");
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: "var(--r)", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "var(--font)" }}>
        {loading ? <Loader2 size={12} style={{ color: "var(--cyan)" }} className="a-spin" /> : <Eye size={12} style={{ color: "var(--cyan)" }} />}
        <span style={{ flex: 1, fontSize: 12, color: "var(--text-2)" }}>{loading ? "Reading files…" : `${done} file${done !== 1 ? "s" : ""} read`}</span>
        <ChevronDown size={11} style={{ color: "var(--text-3)", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>
      {expanded && (
        <div style={{ marginTop: 4, paddingLeft: 8 }}>
          {reads.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px" }}>
              <FileCode size={11} style={{ color: "var(--cyan)", opacity: 0.6 }} />
              <span style={{ flex: 1, fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.file}</span>
              {r.lines && <span style={{ fontSize: 10, color: "var(--text-3)" }}>{r.lines}L</span>}
              {r.status === "done" && <Check size={10} style={{ color: "var(--cyan)", opacity: 0.5 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
FileReadBlock.displayName = "FileReadBlock";

export const CodeDiffBlock = memo(({ change, onApprove, onReject }: {
  change: FileChange; onApprove: () => void; onReject: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasDiff = (change.diff?.length ?? 0) > 0;
  const accentColor = change.action === "created" ? "var(--green)" : change.action === "deleted" ? "var(--red)" : "var(--cyan)";
  const borderColor = change.approved === true ? "rgba(0,229,160,0.25)" : change.approved === false ? "rgba(255,77,106,0.25)" : "var(--border)";
  return (
    <div style={{ borderRadius: "var(--r)", overflow: "hidden", border: `1px solid ${borderColor}`, transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: hasDiff ? "pointer" : "default", background: "rgba(255,255,255,0.02)" }} onClick={() => hasDiff && setExpanded(!expanded)}>
        <FileText size={12} style={{ color: accentColor, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 12, fontFamily: "var(--mono)", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{change.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <span className={change.action === "created" ? "g-badge-new" : change.action === "deleted" ? "g-badge-del" : "g-badge-edit"} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.05em" }}>
            {change.action === "created" ? "NEW" : change.action === "deleted" ? "DEL" : "MOD"}
          </span>
          {(change.linesAdded ?? 0) > 0 && <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--green)" }}>+{change.linesAdded}</span>}
          {(change.linesRemoved ?? 0) > 0 && <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--red)" }}>-{change.linesRemoved}</span>}
          {change.approved == null ? (
            <div style={{ display: "flex", gap: 2 }}>
              <button className="g-icon-btn" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); onApprove(); }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}><Check size={11} /></button>
              <button className="g-icon-btn" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); onReject(); }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}><X size={11} /></button>
            </div>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: change.approved ? "var(--green)" : "var(--red)" }}>{change.approved ? "✓" : "✗"}</span>
          )}
          {hasDiff && <ChevronRight size={11} style={{ color: "var(--text-3)", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "none" }} />}
        </div>
      </div>
      {expanded && hasDiff && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          <pre style={{ margin: 0, fontSize: 11.5, fontFamily: "var(--mono)", background: "rgba(0,0,0,0.25)" }}>
            {change.diff!.map((line, i) => (
              <div key={i} className={line.type === "added" ? "g-diff-add" : line.type === "removed" ? "g-diff-del" : "g-diff-ctx"} style={{ padding: "2px 14px 2px 10px", lineHeight: 1.7, display: "flex", gap: 10 }}>
                <span style={{ color: "var(--text-3)", userSelect: "none", minWidth: 12 }}>{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}</span>
                <span style={{ color: line.type === "added" ? "var(--green)" : line.type === "removed" ? "var(--red)" : "var(--text-2)" }}>{line.content}</span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
});
CodeDiffBlock.displayName = "CodeDiffBlock";

export const Waveform = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
    {Array.from({ length: 14 }, (_, i) => (
      <div key={i} style={{ width: 3, borderRadius: 3, background: "var(--red)", height: 20, transformOrigin: "bottom", animation: `g-wave 0.8s ease-in-out ${i * 0.06}s infinite` }} />
    ))}
  </div>
);