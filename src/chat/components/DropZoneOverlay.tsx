"use client";

interface DropZoneOverlayProps { visible: boolean; }

export function DropZoneOverlay({ visible }: DropZoneOverlayProps) {
  if (!visible) return null;
  return (
    <div className="a-in" style={{
      position: "absolute", inset: 8, zIndex: 100, borderRadius: "var(--r-xl)",
      border: "2px dashed rgba(124,92,255,0.5)",
      background: "rgba(124,92,255,0.06)",
      backdropFilter: "blur(4px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: "var(--p-glow)", border: "1px solid rgba(124,92,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--p-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--p-light)" }}>Drop files here</p>
      <p style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4 }}>Images, PDFs, code files…</p>
    </div>
  );
}