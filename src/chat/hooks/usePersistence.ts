"use client";
import { useState, useEffect, useCallback } from "react";
import type { Conversation } from "../lib/types";

const STORAGE_KEY = "genie:conversations";
const ACTIVE_KEY  = "genie:activeId";
const MAX_STORED  = 60;

function serialize(convs: Conversation[]): string {
  return JSON.stringify(convs.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    messages: c.messages.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    })),
  })));
}

function deserialize(raw: string): Conversation[] {
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch { return []; }
}

export function usePersistence(fallback: Conversation[]) {
  const [hydrated, setHydrated] = useState(false);
  const [conversations, setConversationsRaw] = useState<Conversation[]>(fallback);
  const [activeId, setActiveIdRaw] = useState<string>(fallback[0]?.id ?? "");

  /* Hydrate from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const aid = localStorage.getItem(ACTIVE_KEY);
      if (raw) {
        const loaded = deserialize(raw);
        if (loaded.length > 0) {
          setConversationsRaw(loaded);
          setActiveIdRaw(aid && loaded.find((c) => c.id === aid) ? aid : loaded[0].id);
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  /* Persist on every change */
  const setConversations = useCallback((updater: ((prev: Conversation[]) => Conversation[]) | Conversation[]) => {
    setConversationsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const trimmed = next.slice(0, MAX_STORED);
      try { localStorage.setItem(STORAGE_KEY, serialize(trimmed)); } catch { /* quota */ }
      return trimmed;
    });
  }, []);

  const setActiveId = useCallback((id: string) => {
    setActiveIdRaw(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch { /* ignore */ }
  }, []);

  const clearAll = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(ACTIVE_KEY); } catch { /* ignore */ }
    setConversationsRaw(fallback);
    setActiveIdRaw(fallback[0]?.id ?? "");
  }, [fallback]);

  return { conversations, setConversations, activeId, setActiveId, hydrated, clearAll };
}