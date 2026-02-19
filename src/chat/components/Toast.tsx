"use client";
import { useState, useCallback, createContext, useContext, useRef } from "react";
import { Check, AlertTriangle, Info, X, Zap } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast { id: string; type: ToastType; message: string; duration?: number; }

interface ToastCtx { toast: (msg: string, type?: ToastType, duration?: number) => void; }
const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

const ICONS = { success: Check, error: AlertTriangle, info: Info, warning: Zap };
const COLORS = {
  success: { bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.2)", color: "var(--green)" },
  error:   { bg: "rgba(255,77,106,0.08)", border: "rgba(255,77,106,0.2)", color: "var(--red)" },
  info:    { bg: "rgba(124,92,255,0.08)", border: "rgba(124,92,255,0.2)", color: "var(--p-light)" },
  warning: { bg: "rgba(255,179,64,0.08)", border: "rgba(255,179,64,0.2)", color: "var(--amber)" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((p) => p.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info", duration = 3200) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((p) => [...p.slice(-4), { id, type, message, duration }]);
    const timer = setTimeout(() => dismiss(id), duration);
    timers.current.set(id, timer);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 1000,
        display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end",
        pointerEvents: "none",
      }}>
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          const c = COLORS[t.type];
          return (
            <div key={t.id} className="a-up" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: "var(--r-lg)",
              background: c.bg, border: `1px solid ${c.border}`,
              backdropFilter: "blur(16px)", boxShadow: "var(--shadow)",
              fontSize: 13, color: "var(--text)", minWidth: 220, maxWidth: 360,
              pointerEvents: "all", cursor: "pointer",
            }} onClick={() => dismiss(t.id)}>
              <Icon size={13} style={{ color: c.color, flexShrink: 0 }} />
              <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
              <X size={11} style={{ color: "var(--text-3)", flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}