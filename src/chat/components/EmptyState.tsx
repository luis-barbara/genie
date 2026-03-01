"use client";
import { useEffect, useState } from "react";
import { PlugZap } from "lucide-react";
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
      {/* Logo + orbital rings */}
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 32 }}>

        {/* Outer diffuse halo glow */}
        <div style={{
          position: "absolute",
          inset: -6, borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(124,92,255,0.14) 0%, transparent 70%)",
          animation: "g-halo-pulse 3s ease infinite",
        }} />

        {/* Orbital ring */}
        <div style={{
          position: "absolute", inset: -26,
          borderRadius: "50%", border: "1px solid rgba(124,92,255,0.15)",
        }} />

        {/* Logo card */}
        <div style={{
          width: 72, height: 72, borderRadius: 22, position: "relative",
          background: "linear-gradient(145deg, rgba(124,92,255,0.18) 0%, rgba(8,7,18,0.95) 100%)",
          border: "1px solid rgba(124,92,255,0.32)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(124,92,255,0.08), 0 8px 32px rgba(124,92,255,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}>
          {/* Inner radial glow behind logo */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
            background: "radial-gradient(circle at 48% 38%, rgba(124,92,255,0.22) 0%, transparent 65%)",
          }} />
          {/* Subtle shimmer line */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            borderRadius: 1, pointerEvents: "none",
          }} />
          {/* Logo */}
          <img
            src="/genie-logo-2.png"
            alt="Genie"
            style={{
              width: 36, height: 36, objectFit: "contain",
              position: "relative", zIndex: 1,
              animation: "g-logo-breathe 3.2s ease infinite",
            }}
          />
        </div>

        {/* Orbiting dots — rendered after card so they appear on top */}
        <div style={{ position: "absolute", inset: -26, borderRadius: "50%" }}>
          <div className="g-orbit-dot" style={{ animation: "g-orbit-md 3s linear infinite" }} />
          <div className="g-orbit-dot" style={{ animation: "g-orbit-md 3s linear 1s infinite", background: "var(--cyan)", opacity: 0.5 }} />
          <div className="g-orbit-dot" style={{ animation: "g-orbit-md 3s linear 2s infinite", background: "var(--green)", opacity: 0.3 }} />
        </div>
      </div>

      {/* Rotating headline */}
      <div style={{ height: 42, overflow: "hidden", marginBottom: 20 }}>
        <h2 key={animKey} className="a-up" style={{
          fontSize: 26, fontWeight: 600,
          color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.3,
          fontFamily: "var(--font)",
        }}>
          {ROTATING[rotIdx]}
        </h2>
      </div>

      <p style={{ fontSize: 13.5, color: "var(--text-2)", marginBottom: 28, maxWidth: 320, lineHeight: 1.65 }}>
        {hasProject
          ? `Genie has context on ${projectName ?? "your project"}. Ask anything.`
          : null}
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