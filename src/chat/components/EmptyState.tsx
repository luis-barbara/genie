"use client";
import { useEffect, useState } from "react";
import { PlugZap, Sparkles } from "lucide-react";
import { QUICK_ACTIONS } from "../lib/types";

const ROTATING = [
  "What should we improve today?",
  "What's broken? Let's fix it.",
  "Ready to evolve your product.",
  "Describe the feature you need.",
  "Ask anything about your codebase.",
  "Let's optimize what you already have.",
];

interface EmptyStateProps {
  hasProject: boolean;
  projectName?: string;
  onSend: (text: string) => void;
  onConnectProject?: () => void;
}

export function EmptyState({ hasProject, projectName, onSend, onConnectProject }: EmptyStateProps) {
  const [rotIdx, setRotIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setRotIdx((p) => (p + 1) % ROTATING.length);
      setAnimKey((p) => p + 1);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const actions = hasProject && projectName
    ? [`Analyze ${projectName}`, "Fix bugs", "Add a feature", "Optimize performance"]
    : QUICK_ACTIONS.slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px 20px", textAlign: "center" }}>
      {/* Orbital avatar */}
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
        {/* Ring */}
        <div style={{
          position: "absolute", inset: -12,
          borderRadius: "50%", border: "1px solid rgba(124,92,255,0.12)",
        }} />
        <div style={{
          position: "absolute", inset: -22,
          borderRadius: "50%", border: "1px dashed rgba(124,92,255,0.07)",
        }} />

        {/* Orbiting dots */}
        <div style={{ position: "absolute", inset: -12, borderRadius: "50%" }}>
          <div className="g-orbit-dot" />
          <div className="g-orbit-dot" />
          <div className="g-orbit-dot" />
        </div>

        {/* Center avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: "linear-gradient(135deg, rgba(124,92,255,0.25), rgba(0,212,255,0.12))",
          border: "1px solid rgba(124,92,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(124,92,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        }} className="a-glow">
          <Sparkles size={30} style={{ color: "var(--p-light)" }} />
        </div>
      </div>

      {/* Rotating headline */}
      <div style={{ height: 42, overflow: "hidden", marginBottom: 20 }}>
        <h2 key={animKey} className="a-up g-serif" style={{
          fontSize: 28, fontWeight: 400, fontStyle: "italic",
          color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.3,
        }}>
          {ROTATING[rotIdx]}
        </h2>
      </div>

      <p style={{ fontSize: 13.5, color: "var(--text-2)", marginBottom: 28, maxWidth: 320, lineHeight: 1.65 }}>
        {hasProject
          ? `Genie has context on ${projectName ?? "your project"}. Ask anything.`
          : "Genie helps you improve products that already exist — no starting from scratch."}
      </p>

      {/* Quick chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {onConnectProject && !hasProject && (
          <button onClick={onConnectProject} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px",
            borderRadius: "var(--r-full)",
            background: "linear-gradient(135deg, rgba(124,92,255,0.2), rgba(0,212,255,0.1))",
            border: "1px solid rgba(124,92,255,0.4)", color: "var(--p-light)",
            fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)",
            boxShadow: "0 4px 16px rgba(124,92,255,0.15)", transition: "all 0.18s",
          }}>
            <PlugZap size={13} /> Connect a project
          </button>
        )}
        {actions.map((s, i) => (
          <button key={s} className="g-chip a-up" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => onSend(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}