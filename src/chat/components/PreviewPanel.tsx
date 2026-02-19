"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  RefreshCw, ExternalLink, Monitor, Smartphone, Tablet,
  Loader2, AlertTriangle, PanelRight, ZoomIn, ZoomOut,
} from "lucide-react";
import { cn } from "../lib/types";

interface PreviewPanelProps {
  url?: string;
  refreshTrigger?: number; // increment to force reload
  onClose?: () => void;
}

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORTS: Record<Viewport, { w: number | string; h: number | string; label: string }> = {
  desktop: { w: "100%",  h: "100%",  label: "Desktop" },
  tablet:  { w: 768,     h: "100%",  label: "Tablet"  },
  mobile:  { w: 390,     h: "100%",  label: "Mobile"  },
};

type LoadState = "loading" | "ready" | "error";

export function PreviewPanel({ url, refreshTrigger = 0, onClose }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [zoom, setZoom]         = useState(100);
  const [currentUrl, setCurrentUrl] = useState(url ?? "");
  const [inputUrl, setInputUrl] = useState(url ?? "");
  const [key, setKey] = useState(0); // force iframe remount

  const previewUrl = currentUrl || "about:blank";

  // Auto-detect default URL from env or localhost
  useEffect(() => {
    if (!currentUrl) {
      const discovered =
        (typeof window !== "undefined" && typeof (window as unknown as Record<string, unknown>).__PREVIEW_URL__ === "string"
          ? (window as unknown as Record<string, string>).__PREVIEW_URL__
          : null)
        ?? "http://localhost:3000";
      setCurrentUrl(discovered);
      setInputUrl(discovered);
    }
  }, [currentUrl]);

  // Reload on external trigger (e.g. after applying file changes)
  useEffect(() => {
    if (refreshTrigger > 0) handleRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleRefresh = useCallback(() => {
    setLoadState("loading");
    setKey((k) => k + 1);
  }, []);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let nav = inputUrl.trim();
    if (nav && !nav.startsWith("http")) nav = "http://" + nav;
    setCurrentUrl(nav);
    setLoadState("loading");
    setKey((k) => k + 1);
  };

  const vp = VIEWPORTS[viewport];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--bg)", borderLeft: "1px solid var(--border)",
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "0 12px", height: 46, flexShrink: 0,
        borderBottom: "1px solid var(--border)",
        background: "rgba(7,7,10,0.8)", backdropFilter: "blur(16px)",
      }}>
        {/* Viewport toggles */}
        {([
          { id: "desktop", Icon: Monitor  },
          { id: "tablet",  Icon: Tablet   },
          { id: "mobile",  Icon: Smartphone },
        ] as { id: Viewport; Icon: React.ElementType }[]).map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => setViewport(id)}
            className={cn("g-icon-btn", viewport === id ? "active" : "")}
            style={viewport === id ? { background: "var(--p-glow-2)", color: "var(--p-light)" } : {}}
            title={VIEWPORTS[id].label}>
            <Icon size={13} />
          </button>
        ))}

        <div style={{ width: 1, height: 16, background: "var(--border-2)", margin: "0 2px" }} />

        {/* URL bar */}
        <form onSubmit={handleNavigate} style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: "var(--r)",
            background: "var(--surface)", border: "1px solid var(--border-2)",
          }}>
            {loadState === "loading" && <Loader2 size={11} style={{ color: "var(--text-3)", flexShrink: 0 }} className="a-spin" />}
            {loadState === "ready"   && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0, boxShadow: "0 0 6px var(--green)" }} />}
            {loadState === "error"   && <AlertTriangle size={11} style={{ color: "var(--amber)", flexShrink: 0 }} />}
            <input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onFocus={(e) => e.target.select()}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--text-2)",
                minWidth: 0,
              }}
              placeholder="http://localhost:3000"
            />
          </div>
        </form>

        <div style={{ width: 1, height: 16, background: "var(--border-2)", margin: "0 2px" }} />

        {/* Zoom */}
        <button className="g-icon-btn" onClick={() => setZoom((z) => Math.max(25, z - 25))} title="Zoom out"><ZoomOut size={13} /></button>
        <span style={{ fontSize: 10.5, fontFamily: "var(--mono)", color: "var(--text-3)", minWidth: 32, textAlign: "center" }}>{zoom}%</span>
        <button className="g-icon-btn" onClick={() => setZoom((z) => Math.min(150, z + 25))} title="Zoom in"><ZoomIn size={13} /></button>

        <div style={{ width: 1, height: 16, background: "var(--border-2)", margin: "0 2px" }} />

        <button className="g-icon-btn" onClick={handleRefresh} title="Refresh"><RefreshCw size={13} /></button>
        <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="g-icon-btn" title="Open in new tab">
          <ExternalLink size={13} />
        </a>
        {onClose && (
          <button className="g-icon-btn" onClick={onClose} title="Hide preview"><PanelRight size={13} /></button>
        )}
      </div>

      {/* Iframe stage */}
      <div style={{
        flex: 1, overflow: "hidden",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        background: viewport !== "desktop" ? "rgba(0,0,0,0.4)" : "transparent",
        padding: viewport !== "desktop" ? 16 : 0,
        position: "relative",
      }}>
        <div style={{
          width: vp.w === "100%" ? "100%" : undefined,
          maxWidth: vp.w === "100%" ? "100%" : vp.w,
          minWidth: vp.w === "100%" ? undefined : vp.w,
          height: "100%",
          border: viewport !== "desktop" ? "1px solid var(--border-2)" : "none",
          borderRadius: viewport !== "desktop" ? "var(--r-lg)" : 0,
          overflow: "hidden",
          boxShadow: viewport !== "desktop" ? "var(--shadow-lg)" : "none",
          position: "relative",
        }}>
          {loadState === "loading" && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg)", zIndex: 2,
            }}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Loader2 size={22} className="a-spin" style={{ color: "var(--p-light)" }} />
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>Loading preview…</span>
              </div>
            </div>
          )}
          {loadState === "error" && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg)", zIndex: 2,
            }}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <AlertTriangle size={22} style={{ color: "var(--amber)" }} />
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>Could not load preview</span>
                <span style={{ fontSize: 11.5, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                  Make sure the dev server is running at<br />{currentUrl}
                </span>
                <button
                  onClick={handleRefresh}
                  style={{ marginTop: 6, padding: "6px 16px", borderRadius: "var(--r-full)", background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font)" }}>
                  <RefreshCw size={11} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                  Retry
                </button>
              </div>
            </div>
          )}
          <iframe
            key={key}
            ref={iframeRef}
            src={previewUrl}
            title="Live Preview"
            onLoad={() => setLoadState("ready")}
            onError={() => setLoadState("error")}
            style={{
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`,
              transformOrigin: "top left",
              transform: `scale(${zoom / 100})`,
              border: "none",
              display: "block",
            }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-pointer-lock"
          />
        </div>
      </div>
    </div>
  );
}
