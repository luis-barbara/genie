"use client";
import { useState } from "react";
import {
  MessageSquare, Plus, X, Search, Pin, Archive, Trash2,
  MoreHorizontal,
} from "lucide-react";
import type { Conversation } from "../lib/types";
import { timeAgo } from "../lib/types";

interface ConvSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

export function ConvSidebar({
  conversations, activeId, onSelect, onNew, onArchive, onDelete, onPin, open, onClose,
}: ConvSidebarProps) {
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);

  if (!open) return null;

  const filtered = conversations.filter(
    (c) => c.archived === showArchived && (!q || c.title.toLowerCase().includes(q.toLowerCase()))
  );
  const pinned = filtered.filter((c) => c.pinned);
  const rest = filtered.filter((c) => !c.pinned);

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose} />

      {/* Panel */}
      <div className="g-sidebar a-slide-r" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 264, zIndex: 50, display: "flex", flexDirection: "column" }}>
        {/* Mobile drag handle — only visible via CSS on ≤640 px */}
        <div className="g-sidebar-handle" aria-hidden />
        {/* Header */}
        <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: "var(--p-glow-2)", border: "1px solid rgba(124,92,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={12} style={{ color: "var(--p-light)" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Chats</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              <button className="g-icon-btn" style={{ padding: 5 }} onClick={onNew}><Plus size={14} /></button>
              <button className="g-icon-btn" style={{ padding: 5 }} onClick={onClose}><X size={14} /></button>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: "var(--r)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <Search size={11} style={{ color: "var(--text-2)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--text)", fontFamily: "var(--font)" }} />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
            {["Active", "Archived"].map((tab) => (
              <button key={tab} onClick={() => setShowArchived(tab === "Archived")} style={{
                padding: "4px 11px", borderRadius: "var(--r-sm)", fontSize: 11, fontWeight: 500,
                cursor: "pointer", border: "none", fontFamily: "var(--font)",
                background: (tab === "Archived") === showArchived ? "var(--p-glow-2)" : "transparent",
                color: (tab === "Archived") === showArchived ? "var(--p-light)" : "var(--text-2)",
                transition: "all 0.15s",
              }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="g-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
          {pinned.length > 0 && (
            <>
              <SectionLabel>📌 Pinned</SectionLabel>
              {pinned.map((c) => (
                <SidebarRow key={c.id} conv={c} isActive={c.id === activeId}
                  onSelect={() => { onSelect(c.id); onClose(); }}
                  menuOpen={menuId === c.id} onMenu={() => setMenuId(menuId === c.id ? null : c.id)}
                  onArchive={() => { onArchive(c.id); setMenuId(null); }}
                  onDelete={() => { onDelete(c.id); setMenuId(null); }}
                  onPin={() => { onPin(c.id); setMenuId(null); }}
                />
              ))}
            </>
          )}
          {rest.length > 0 && (
            <>
              {pinned.length > 0 && <SectionLabel style={{ paddingTop: 12 }}>Recent</SectionLabel>}
              {rest.map((c) => (
                <SidebarRow key={c.id} conv={c} isActive={c.id === activeId}
                  onSelect={() => { onSelect(c.id); onClose(); }}
                  menuOpen={menuId === c.id} onMenu={() => setMenuId(menuId === c.id ? null : c.id)}
                  onArchive={() => { onArchive(c.id); setMenuId(null); }}
                  onDelete={() => { onDelete(c.id); setMenuId(null); }}
                  onPin={() => { onPin(c.id); setMenuId(null); }}
                />
              ))}
            </>
          )}
          {filtered.length === 0 && (
            <div style={{ padding: "36px 14px", textAlign: "center" }}>
              <p style={{ fontSize: 12.5, color: "var(--text-2)" }}>{showArchived ? "No archived chats" : "No conversations yet"}</p>
              {!showArchived && (
                <button onClick={onNew} style={{ marginTop: 10, padding: "6px 14px", borderRadius: "var(--r-full)", background: "var(--p-glow-2)", border: "1px solid rgba(124,92,255,0.25)", color: "var(--p-light)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font)" }}>Start a chat</button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-2)", padding: "4px 8px", marginBottom: 2, ...style }}>
      {children}
    </p>
  );
}

function SidebarRow({ conv, isActive, onSelect, menuOpen, onMenu, onArchive, onDelete, onPin }: {
  conv: Conversation; isActive: boolean; onSelect: () => void;
  menuOpen: boolean; onMenu: () => void;
  onArchive: () => void; onDelete: () => void; onPin: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const last = conv.messages[conv.messages.length - 1];

  return (
    <div style={{ position: "relative" }}>
      <button onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%", display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 8px 8px 10px",
          borderRadius: "var(--r)", cursor: "pointer", textAlign: "left", border: "none", fontFamily: "var(--font)",
          background: isActive ? "rgba(124,92,255,0.1)" : hovered ? "rgba(255,255,255,0.03)" : "transparent",
          borderLeft: `2px solid ${isActive ? "var(--p)" : "transparent"}`,
          transition: "all 0.12s",
        }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: isActive ? "var(--p-light)" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              {conv.title}
            </span>
            {conv.pinned && <Pin size={9} style={{ color: "var(--p-light)", opacity: 0.6, flexShrink: 0 }} />}
          </div>
          {last && (
            <p style={{ fontSize: 11, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
              {last.role === "user" ? "You: " : ""}{last.content.slice(0, 48)}
            </p>
          )}
          <span style={{ fontSize: 10, color: "var(--text-3)", opacity: 0.8 }}>{timeAgo(conv.updatedAt)}</span>
        </div>
        {hovered && (
          <button onClick={(e) => { e.stopPropagation(); onMenu(); }} className="g-icon-btn" style={{ flexShrink: 0, padding: 4 }}>
            <MoreHorizontal size={12} />
          </button>
        )}
      </button>

      {menuOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 60 }} onClick={onMenu} />
          <div className="g-glass-2" style={{
            position: "absolute", right: 6, top: "100%", marginTop: 4,
            width: 155, zIndex: 70, borderRadius: "var(--r-lg)", overflow: "hidden", padding: "4px 0",
          }}>
            {[
              { icon: Pin, label: conv.pinned ? "Unpin" : "Pin", action: onPin, danger: false },
              { icon: Archive, label: conv.archived ? "Unarchive" : "Archive", action: onArchive, danger: false },
              { icon: Trash2, label: "Delete", action: onDelete, danger: true },
            ].map((item) => (
              <button key={item.label} onClick={item.action} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
                background: "transparent", border: "none", cursor: "pointer", fontSize: 12.5, fontFamily: "var(--font)",
                color: item.danger ? "var(--red)" : "var(--text-2)", textAlign: "left", transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = item.danger ? "rgba(255,77,106,0.08)" : "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <item.icon size={12} /> {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}