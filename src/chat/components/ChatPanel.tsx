"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  MessageSquare, Plus, ChevronDown, AlertTriangle, X,
  Command, PlugZap, ImagePlus, FileText,
  PanelRight, GitPullRequest, Rocket, CheckCircle2, Loader2,
} from "lucide-react";
import type { Message, Conversation, Attachment, Project, FileChange } from "../lib/types";
import { MODELS, buildSystemPrompt, buildHistory, autoTitle } from "../lib/types";
import type { GenieModel } from "../lib/types";
import { GLOBAL_STYLES } from "../styles/tokens";
import { useClaudeStream } from "../hooks/useClaudeStream";
import { usePersistence } from "../hooks/usePersistence";
import { useDragDrop } from "../hooks/useDragDrop";
import { parseFileChanges, stripFileChanges } from "../lib/engine";
import { GenieAvatar, DotLoader, ContextBar } from "./Primitives";
import { ModelSelector, InputBox } from "./InputBox";
import { MessageBubble } from "./MessageBubble";
import { ConvSidebar } from "./ConvSidebar";
import { CommandPalette } from "./CommandPalette";
import { EmptyState } from "./EmptyState";
import { DropZoneOverlay } from "./DropZoneOverlay";
import { ToastProvider, useToast } from "./Toast";
import { Prose } from "./Prose";
import { PreviewPanel } from "./PreviewPanel";

export interface ChatPanelProps {
  hasProject?: boolean;
  project?: Project | null;
  onConnectProject?: () => void;
}

function makeWelcomeConv(hasProject: boolean): Conversation {
  return {
    id: hasProject ? "conv-1" : "welcome",
    title: hasProject ? "New Conversation" : "Welcome",
    messages: hasProject ? [] : [{
      id: "greeting", role: "assistant" as const,
      content: "Hello! I'm **Genie**, your AI development partner.\n\nI specialise in **existing products** — debugging, refactoring, optimising, and extending what you already have. No starting from scratch.\n\nWhat would you like to improve today?",
      timestamp: new Date(),
    }],
    createdAt: new Date(), updatedAt: new Date(), archived: false, pinned: false,
  };
}

function ChatPanelInner({ hasProject = false, project = null, onConnectProject }: ChatPanelProps) {
  const effectiveProject = hasProject ? project : null;
  const { toast } = useToast();

  const fallback = [makeWelcomeConv(hasProject)];
  const { conversations, setConversations, activeId, setActiveId, hydrated } = usePersistence(fallback);

  const [model, setModel] = useState<GenieModel>(MODELS[1]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);

  // Preview panel
  const [showPreview, setShowPreview] = useState(false);
  const [previewRefresh, setPreviewRefresh] = useState(0);

  // GitHub PR
  type PRState = "idle" | "creating" | "done" | "error";
  const [prState, setPrState]   = useState<PRState>("idle");
  const [prUrl, setPrUrl]       = useState<string | null>(null);
  const [prBranch, setPrBranch] = useState<string | null>(null);

  // Deploy
  type DeployState = "idle" | "deploying" | "done" | "error";
  const [deployState, setDeployState] = useState<DeployState>("idle");
  const [deployUrl, setDeployUrl]     = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { stream, abort } = useClaudeStream();

  const activeConv = conversations.find((c: Conversation) => c.id === activeId);
  const messages = useMemo(() => activeConv?.messages ?? [], [activeConv]);

  /* ---- Drag & drop ---- */
  const handleDropFiles = useCallback((files: Attachment[]) => {
    setAttachments((p) => [...p, ...files]);
    toast(`${files.length} file${files.length > 1 ? "s" : ""} attached`, "success");
  }, [toast]);
  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragDrop(handleDropFiles);

  /* ---- New conversation (defined early so keyboard shortcut can use it) ---- */
  const newConversation = useCallback(() => {
    const c: Conversation = { id: `c${Date.now()}`, title: "New Conversation", messages: [], createdAt: new Date(), updatedAt: new Date(), archived: false, pinned: false };
    setConversations((p: Conversation[]) => [c, ...p]);
    setActiveId(c.id);
    setShowSidebar(false);
    setTotalTokensUsed(0);
  }, [setConversations, setActiveId]);

  /* ---- Keyboard shortcuts ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowPalette(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") { e.preventDefault(); newConversation(); }
      if (e.key === "ArrowUp" && !input && document.activeElement?.tagName !== "TEXTAREA") {
        // Edit last user message with ↑ when input is empty
        const lastUser = [...messages].reverse().find((m: Message) => m.role === "user");
        if (lastUser) setInput(lastUser.content);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input, messages, newConversation]);

  /* ---- Smart scroll ---- */
  const userScrolled = useRef(false);
  const scrollToBottom = useCallback((force = false) => {
    if (force || !userScrolled.current) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!userScrolled.current) scrollToBottom();
  }, [messages.length, isLoading, scrollToBottom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      setShowScrollBtn(!atBottom);
      userScrolled.current = !atBottom;
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  /* ---- Image preview for drag-dropped images ---- */
  useEffect(() => {
    attachments.forEach((att) => {
      if (att.file && att.type === "image" && !att.preview) {
        const url = URL.createObjectURL(att.file);
        setAttachments((p) => p.map((a) => a.id === att.id ? { ...a, preview: url } : a));
      }
    });
  }, [attachments]);

  /* ---- Helpers ---- */
  const updateMessages = useCallback((msgs: Message[]) => {
    setConversations((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: msgs, updatedAt: new Date() } : c));
  }, [activeId, setConversations]);

  /* ---- Core send ---- */
  const sendMessage = useCallback(async (text?: string, fromEdit?: { replaceFrom: string }) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;
    setApiError(null);
    userScrolled.current = false;

    let nextMsgs: Message[];
    if (fromEdit) {
      // Replace from the edited message onwards
      const idx = messages.findIndex((m) => m.id === fromEdit.replaceFrom);
      const edited: Message = { ...messages[idx], content, editedAt: new Date() };
      nextMsgs = [...messages.slice(0, idx), edited];
    } else {
      const userMsg: Message = {
        id: `u${Date.now()}`, role: "user", content, timestamp: new Date(),
        attachments: attachments.length ? [...attachments] : undefined,
      };
      nextMsgs = [...messages, userMsg];
    }

    updateMessages(nextMsgs);
    setInput(""); setAttachments([]); setIsLoading(true);

    const aId = `a${Date.now() + 1}`;
    const placeholder: Message = { id: aId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true };
    setConversations((prev) => prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, placeholder], updatedAt: new Date() } : c));

    const t0 = Date.now();
    await stream({
      messages: buildHistory(nextMsgs),
      system: buildSystemPrompt(effectiveProject),
      model: model.apiModel,
      enableCodeEngine: hasProject,
      onFileRead: (file, lines) => {
        setConversations((prev) => prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id !== aId) return m;
              const existing = m.fileReads ?? [];
              const updated = existing.some((r) => r.file === file)
                ? existing.map((r) => r.file === file ? { ...r, lines, status: "done" as const } : r)
                : [...existing, { file, lines, status: "done" as const }];
              return { ...m, fileReads: updated };
            }),
          };
        }));
      },
      onChunk: (chunk) => {
        setConversations((prev) => prev.map((c) => {
          if (c.id !== activeId) return c;
          return { ...c, messages: c.messages.map((m) => m.id === aId ? { ...m, content: m.content + chunk } : m) };
        }));
      },
      onDone: (inputTok, outputTok) => {
        const elapsed = (Date.now() - t0) / 1000;
        const tps = elapsed > 0 ? Math.round(outputTok / elapsed) : 0;
        const costCents = (inputTok / 1_000_000) * model.inputCostPer1M + (outputTok / 1_000_000) * model.outputCostPer1M;
        const total = inputTok + outputTok;
        setTotalTokensUsed((p) => p + total);
        setConversations((prev) => prev.map((c) => {
          if (c.id !== activeId) return c;
          const title = c.title === "New Conversation" || c.title === "Welcome" ? autoTitle(content) : c.title;
          return {
            ...c, title,
            messages: c.messages.map((m) => {
              if (m.id !== aId) return m;
              // Parse <genie_change> blocks and strip them from display text
              const fileChanges = parseFileChanges(m.content);
              const displayContent = fileChanges.length > 0 ? stripFileChanges(m.content) : m.content;
              return {
                ...m,
                content: displayContent,
                ...(fileChanges.length > 0 ? { fileChanges } : {}),
                isStreaming: false,
                tokenUsage: { promptTokens: inputTok, completionTokens: outputTok, totalTokens: total, costCents, tokensPerSecond: tps },
              };
            }),
          };
        }));
        setIsLoading(false);
      },
      onError: (err) => {
        setApiError(err);
        toast(err, "error", 5000);
        setConversations((prev) => prev.map((c) => {
          if (c.id !== activeId) return c;
          return { ...c, messages: c.messages.map((m) => m.id === aId ? { ...m, isStreaming: false, content: err, isError: true } : m) };
        }));
        setIsLoading(false);
      },
    });
  }, [input, isLoading, messages, attachments, activeId, model, effectiveProject, hasProject, stream, updateMessages, setConversations, toast]);

  /* ---- Edit user message ---- */
  const editMessage = useCallback((msgId: string, newContent: string) => {
    sendMessage(newContent, { replaceFrom: msgId });
  }, [sendMessage]);

  /* ---- Retry last assistant message ---- */
  const retryMessage = useCallback((msgId: string) => {
    const idx = messages.findIndex((m) => m.id === msgId);
    if (idx < 1) return;
    // Find last user message before this assistant message
    const prevUser = [...messages.slice(0, idx)].reverse().find((m) => m.role === "user");
    if (!prevUser) return;
    // Remove from prevUser+1 onwards and resend
    const trimmed = messages.slice(0, messages.indexOf(prevUser) + 1);
    updateMessages(trimmed);
    setTimeout(() => sendMessage(prevUser.content), 50);
  }, [messages, sendMessage, updateMessages]);

  const resolveAction = (msgId: string, ai: number, val: string | string[]) => {
    updateMessages(messages.map((m) => {
      if (m.id !== msgId || !m.actions) return m;
      const acts = [...m.actions]; acts[ai] = { ...acts[ai], resolved: val }; return { ...m, actions: acts };
    }));
  };

  const approveFile = useCallback(async (msgId: string, fi: number, approved: boolean) => {
    // Optimistically update UI first
    setConversations((prev) => prev.map((c) => {
      if (c.id !== activeId) return c;
      return {
        ...c,
        messages: c.messages.map((m) => {
          if (m.id !== msgId || !m.fileChanges) return m;
          const changes = [...m.fileChanges];
          changes[fi] = { ...changes[fi], approved };
          return { ...m, fileChanges: changes };
        }),
      };
    }));

    if (!approved) {
      toast("Change rejected", "error");
      return;
    }

    // Apply the change to disk
    const msg = conversations.find((c) => c.id === activeId)?.messages.find((m) => m.id === msgId);
    const change = msg?.fileChanges?.[fi];
    if (!change) return;

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: [change] }),
      });
      const data = await res.json() as { results: { file: string; ok: boolean; error?: string }[] };
      const result = data.results?.[0];
      if (result?.ok) {
        toast(`Applied: ${change.name}`, "success");
        // Trigger preview refresh
        setPreviewRefresh((n) => n + 1);
      } else {
        toast(`Failed: ${result?.error ?? "unknown error"}`, "error", 5000);
        // Revert the optimistic approval
        setConversations((prev) => prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id !== msgId || !m.fileChanges) return m;
              const changes = [...m.fileChanges];
              changes[fi] = { ...changes[fi], approved: null };
              return { ...m, fileChanges: changes };
            }),
          };
        }));
      }
    } catch (err) {
      toast(`Network error: ${(err as Error).message}`, "error", 5000);
    }
  }, [activeId, conversations, setConversations, toast]);

  const revertTo = useCallback((msgId: string) => {
    const idx = messages.findIndex((m: Message) => m.id === msgId);
    if (idx < 0) return;
    const sysId = `s${Date.now()}`;
    const sysTs = new Date();
    updateMessages([
      ...messages.slice(0, idx + 1),
      { id: sysId, role: "system", content: `Reverted to: "${messages[idx].content.slice(0, 45)}…"`, timestamp: sysTs },
      ...messages.slice(idx + 1).map((m: Message) => ({ ...m, isReverted: true })),
    ]);
    toast("Reverted", "info");
  }, [messages, updateMessages, toast]);

  /* ---- Collect all approved file changes across the conversation ---- */
  const approvedChanges = useMemo((): FileChange[] => {
    return conversations
      .find((c) => c.id === activeId)?.messages
      .flatMap((m) => m.fileChanges ?? [])
      .filter((fc) => fc.approved === true)
      ?? [];
  }, [conversations, activeId]);

  /* ---- Create GitHub PR ---- */
  const createPR = useCallback(async () => {
    if (!approvedChanges.length || prState === "creating") return;
    setPrState("creating");
    try {
      const files = approvedChanges.map((fc) => ({
        path: fc.name,
        content: fc.updatedContent ?? "",
        action: fc.action,
      }));
      const conv = conversations.find((c) => c.id === activeId);
      const title = conv?.title ?? "Genie: automated change";
      const desc  = `Changes applied via Genie chat on ${new Date().toLocaleDateString()}.`;
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, title, description: desc }),
      });
      const data = await res.json() as { prUrl?: string; branch?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Unknown error");
      setPrUrl(data.prUrl ?? null);
      setPrBranch(data.branch ?? null);
      setPrState("done");
      toast("Pull request created! 🎉", "success", 6000);
    } catch (err) {
      setPrState("error");
      toast(`PR failed: ${(err as Error).message}`, "error", 6000);
    }
  }, [approvedChanges, prState, conversations, activeId, toast]);

  /* ---- Deploy ---- */
  const triggerDeploy = useCallback(async () => {
    if (deployState === "deploying") return;
    setDeployState("deploying");
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: prBranch ?? "main" }),
      });
      const data = await res.json() as { triggered?: boolean; deployUrl?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Unknown error");
      setDeployUrl(data.deployUrl ?? null);
      setDeployState("done");
      toast("Deploy triggered! 🚀", "success", 6000);
    } catch (err) {
      setDeployState("error");
      toast(`Deploy failed: ${(err as Error).message}`, "error", 6000);
    }
  }, [deployState, prBranch, toast]);

  if (!hydrated) return (
    <div className="genie" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <style>{GLOBAL_STYLES}</style>
      <div className="genie-bg" />
      <div style={{ display: "flex", gap: 5 }}>
        {[0,1,2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--p-light)", animation: `g-bounce 0.9s ease ${i * 0.15}s infinite` }} />)}
      </div>
    </div>
  );

  /* ================================================================
     NO PROJECT — centered landing
  ================================================================ */
  if (!hasProject) {
    return (
      <div className="genie" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 20px", position: "relative" }}
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
        <style>{GLOBAL_STYLES}</style>
        <div className="genie-bg" />
        <DropZoneOverlay visible={isDragging} />

        {messages.length > 1 && (
          <div ref={scrollRef} className="g-scroll" style={{ width: "100%", maxWidth: 620, maxHeight: "56vh", overflowY: "auto", marginBottom: 24, display: "flex", flexDirection: "column", gap: 20, position: "relative", zIndex: 1 }}>
            {messages.slice(1).map((msg, i) => (
              <div key={msg.id} className="a-up" style={{ animationDelay: `${i * 0.04}s` }}>
                {msg.role === "assistant" ? (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <GenieAvatar size={28} />
                    <div style={{ flex: 1 }}>
                      <Prose content={msg.content} streaming={msg.isStreaming} />
                      {msg.isStreaming && msg.content.length === 0 && <DotLoader />}
                      {!msg.isStreaming && onConnectProject && i === messages.length - 2 && (
                        <button onClick={onConnectProject} className="g-chip" style={{ marginTop: 12 }}>
                          <PlugZap size={11} /> Connect a project for full power
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="g-user-bubble" style={{ padding: "10px 15px", maxWidth: "78%", fontSize: 14.5, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <GenieAvatar size={28} /> <DotLoader />
              </div>
            )}
          </div>
        )}

        {messages.length <= 1 && (
          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <EmptyState hasProject={false} onSend={sendMessage} onConnectProject={onConnectProject} />
          </div>
        )}

        <div style={{ width: "100%", maxWidth: 620, position: "relative", zIndex: 1 }}>
          {attachments.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {attachments.map((att) => <AttachPill key={att.id} att={att} onRemove={() => setAttachments((p) => p.filter((a) => a.id !== att.id))} />)}
            </div>
          )}
          <InputBox input={input} setInput={setInput} onSend={sendMessage} isLoading={isLoading} onStop={abort}
            isRecording={isRecording} onToggleRecording={() => setIsRecording(!isRecording)}
            attachments={attachments} setAttachments={setAttachments}
            onPaletteOpen={() => setShowPalette(true)} focused={inputFocused} setFocused={setInputFocused}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 2px 0" }}>
            <ModelSelector selected={model} onSelect={setModel} />
            <span style={{ fontSize: 10, color: "var(--text-2)", opacity: 0.6, fontFamily: "var(--mono)" }}>⌘K commands · ↵ send · ⇧↵ newline</span>
          </div>
        </div>

        {apiError && <ErrorBanner msg={apiError} onClose={() => setApiError(null)} style={{ maxWidth: 620, width: "100%", marginTop: 10 }} />}
        <CommandPalette open={showPalette} onClose={() => setShowPalette(false)} onSend={sendMessage} onNewConv={newConversation} />
      </div>
    );
  }

  /* ================================================================
     WITH PROJECT — full panel
  ================================================================ */
  return (
    <div className="genie" style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
      onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
      <style>{GLOBAL_STYLES}</style>
      <div className="genie-bg" />
      <DropZoneOverlay visible={isDragging} />

      <ConvSidebar conversations={conversations} activeId={activeId}
        onSelect={(id) => { setActiveId(id); setTotalTokensUsed(0); }} onNew={newConversation}
        onArchive={(id) => { setConversations((p) => p.map((c) => c.id === id ? { ...c, archived: !c.archived } : c)); toast("Archived", "info"); }}
        onDelete={(id) => { const next = conversations.filter((c) => c.id !== id); setConversations(() => next); if (activeId === id && next.length) setActiveId(next[0].id); toast("Deleted", "info"); }}
        onPin={(id) => setConversations((p) => p.map((c) => c.id === id ? { ...c, pinned: !c.pinned } : c))}
        open={showSidebar} onClose={() => setShowSidebar(false)}
      />

      {/* Header */}
      <header className="g-chat-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", height: 54, flexShrink: 0, position: "relative", zIndex: 10, background: "rgba(7,7,10,0.75)", backdropFilter: "blur(20px) saturate(1.4)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="g-icon-btn g-tooltip" data-tip="Chats (⌘B)" onClick={() => setShowSidebar(true)}><MessageSquare size={15} /></button>
          <button className="g-icon-btn g-tooltip" data-tip="New chat (⌘N)" onClick={newConversation}><Plus size={15} /></button>
          <div style={{ width: 1, height: 16, background: "var(--border-2)", margin: "0 4px" }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeConv?.title ?? "Genie"}
            </p>
            <p style={{ fontSize: 10.5, color: "var(--text-2)" }}>
              {messages.filter((m) => m.role !== "system").length} messages
              {effectiveProject && <> · <span style={{ color: "rgba(124,92,255,0.7)" }}>{effectiveProject.name}</span></>}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {totalTokensUsed > 0 && <ContextBar used={totalTokensUsed} max={model.contextK} />}
          {effectiveProject && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: "var(--r-full)", background: "rgba(0,229,160,0.07)", border: "1px solid rgba(0,229,160,0.15)" }}>
              <div className="g-status-live" />
              <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(0,229,160,0.8)" }}>
                {effectiveProject.connections.filter((c) => c.status === "connected").length} live
              </span>
            </div>
          )}

          {/* PR button — visible when there are approved changes */}
          {approvedChanges.length > 0 && (
            <button
              onClick={prState === "done" && prUrl ? () => window.open(prUrl, "_blank") : createPR}
              disabled={prState === "creating"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: "var(--r-full)",
                fontSize: 11.5, fontWeight: 600, cursor: prState === "creating" ? "wait" : "pointer",
                border: "none", fontFamily: "var(--font)",
                background: prState === "done" ? "var(--green-glow)" : prState === "error" ? "var(--red-glow)" : "var(--p-glow-2)",
                color: prState === "done" ? "var(--green)" : prState === "error" ? "var(--red)" : "var(--p-light)",
                transition: "all 0.2s",
              }}
              title={prState === "done" && prUrl ? `Open PR ${prUrl}` : "Create Pull Request on GitHub"}>
              {prState === "creating" ? <Loader2 size={11} className="a-spin" /> :
               prState === "done"     ? <CheckCircle2 size={11} /> :
               <GitPullRequest size={11} />}
              {prState === "done" ? "PR #" + prBranch?.split("-").pop() :  prState === "creating" ? "Creating PR…" : `Open PR (${approvedChanges.length})`}
            </button>
          )}

          {/* Deploy button — visible after PR or always if hook configured */}
          {(prState === "done" || deployState !== "idle") && (
            <button
              onClick={deployState === "done" && deployUrl ? () => window.open(deployUrl, "_blank") : triggerDeploy}
              disabled={deployState === "deploying"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: "var(--r-full)",
                fontSize: 11.5, fontWeight: 600, cursor: deployState === "deploying" ? "wait" : "pointer",
                border: "none", fontFamily: "var(--font)",
                background: deployState === "done" ? "var(--cyan-glow)" : deployState === "error" ? "var(--red-glow)" : "linear-gradient(135deg, var(--p-dark), var(--p))",
                color: deployState === "done" ? "var(--cyan)" : deployState === "error" ? "var(--red)" : "#fff",
                boxShadow: deployState === "idle" ? "0 2px 10px rgba(124,92,255,0.25)" : "none",
                transition: "all 0.2s",
              }}
              title={deployState === "done" && deployUrl ? `View deployment` : "Trigger Vercel deployment"}>
              {deployState === "deploying" ? <Loader2 size={11} className="a-spin" /> :
               deployState === "done"      ? <CheckCircle2 size={11} /> :
               <Rocket size={11} />}
              {deployState === "done" ? "Deployed" : deployState === "deploying" ? "Deploying…" : "Deploy"}
            </button>
          )}

          <button
            className="g-icon-btn g-tooltip"
            data-tip={showPreview ? "Hide preview" : "Live preview"}
            onClick={() => setShowPreview((v) => !v)}
            style={showPreview ? { background: "var(--p-glow-2)", color: "var(--p-light)" } : {}}>
            <PanelRight size={15} />
          </button>
          <button className="g-icon-btn g-tooltip" data-tip="Command palette (⌘K)" onClick={() => setShowPalette(true)}><Command size={15} /></button>
        </div>
      </header>

      {/* Body — chat + optional preview split */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 }}>

      {/* Chat column */}
      <div style={{ flex: showPreview ? "0 0 42%" : "1 1 auto", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
      <div ref={scrollRef} className="g-scroll g-msg-list" style={{ flex: 1, overflowY: "auto", padding: "24px 20px 12px", display: "flex", flexDirection: "column", gap: 22, position: "relative", zIndex: 1 }}>
        {messages.length === 0
          ? <EmptyState hasProject projectName={effectiveProject?.name} onSend={sendMessage} />
          : messages.map((msg, i) => (
              <div key={msg.id} className="a-up" style={{ animationDelay: `${Math.min(i * 0.025, 0.18)}s` }}>
                <MessageBubble message={msg}
                  onResolve={(ai, v) => resolveAction(msg.id, ai, v)}
                  onSend={sendMessage}
                  onFileApprove={(fi) => approveFile(msg.id, fi, true)}
                  onFileReject={(fi) => approveFile(msg.id, fi, false)}
                  onRevert={() => revertTo(msg.id)}
                  onEdit={(newContent) => editMessage(msg.id, newContent)}
                  onRetry={() => retryMessage(msg.id)}
                />
              </div>
            ))
        }
        {isLoading && messages[messages.length - 1]?.isStreaming !== true && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <GenieAvatar size={24} /><DotLoader />
          </div>
        )}
      </div>

      {/* Scroll btn */}
      {showScrollBtn && (
        <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 5, marginBottom: -4, marginTop: -8 }}>
          <button onClick={() => { userScrolled.current = false; scrollToBottom(true); }} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: "var(--r-full)", background: "var(--glass-2)", border: "1px solid var(--border-2)", boxShadow: "var(--shadow)", fontSize: 11.5, color: "var(--text-2)", cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s" }}>
            <ChevronDown size={12} /> Latest messages
          </button>
        </div>
      )}

      {messages.length === 0 && (
        <div style={{ padding: "0 16px 6px", display: "flex", flexWrap: "wrap", gap: 6, position: "relative", zIndex: 1 }}>
          {(effectiveProject ? [`Analyze ${effectiveProject.name}`, "Find bugs", "Optimize bundle", "Write tests"] : ["What can you do?", "Fix a bug", "Add dark mode", "Help me start"])
            .map((s) => <button key={s} className="g-chip" style={{ fontSize: 12 }} onClick={() => sendMessage(s)}>{s}</button>)}
        </div>
      )}

      {attachments.length > 0 && (
        <div style={{ padding: "0 16px 6px", display: "flex", gap: 6, flexWrap: "wrap", zIndex: 1, position: "relative" }}>
          {attachments.map((att) => <AttachPill key={att.id} att={att} onRemove={() => setAttachments((p) => p.filter((a) => a.id !== att.id))} />)}
        </div>
      )}

      {apiError && <ErrorBanner msg={apiError} onClose={() => setApiError(null)} style={{ margin: "0 16px 8px" }} />}

      <div className="g-input-area" style={{ padding: "6px 16px 16px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <InputBox input={input} setInput={setInput} onSend={sendMessage} isLoading={isLoading} onStop={abort}
          isRecording={isRecording} onToggleRecording={() => setIsRecording(!isRecording)}
          attachments={attachments} setAttachments={setAttachments}
          onPaletteOpen={() => setShowPalette(true)} focused={inputFocused} setFocused={setInputFocused}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 2px 0" }}>
          <ModelSelector selected={model} onSelect={setModel} />
          <span style={{ fontSize: 10, color: "var(--text-3)", opacity: 0.3, fontFamily: "var(--mono)" }}>⌘K · ↵ send · ⇧↵ newline · ↑ edit last</span>
        </div>
      </div>

      </div>{/* end chat column */}

      {/* Preview column */}
      {showPreview && (
        <div style={{ flex: "1 1 58%", minWidth: 0, overflow: "hidden" }}>
          <PreviewPanel
            refreshTrigger={previewRefresh}
            onClose={() => setShowPreview(false)}
          />
        </div>
      )}

      </div>{/* end body split */}

      <CommandPalette open={showPalette} onClose={() => setShowPalette(false)} onSend={sendMessage} onNewConv={newConversation} />
    </div>
  );
}

// Wrap with providers
export default function ChatPanel(props: ChatPanelProps) {
  return (
    <ToastProvider>
      <ChatPanelInner {...props} />
    </ToastProvider>
  );
}

function AttachPill({ att, onRemove }: { att: Attachment; onRemove: () => void }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: att.preview ? "3px 8px 3px 3px" : "5px 10px", borderRadius: "var(--r)", background: "var(--surface-2)", border: "1px solid var(--border-2)", fontSize: 12, transition: "border-color 0.15s" }}>
      {att.preview
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={att.preview} alt={att.name} style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover" }} />
        : att.type === "image" ? <ImagePlus size={11} style={{ color: "var(--p-light)" }} /> : <FileText size={11} style={{ color: "var(--cyan)" }} />
      }
      <span style={{ color: "var(--text-2)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.name}</span>
      <button className="g-icon-btn" style={{ padding: 2 }} onClick={onRemove}><X size={10} /></button>
    </div>
  );
}

function ErrorBanner({ msg, onClose, style }: { msg: string; onClose: () => void; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 13px", borderRadius: "var(--r-lg)", background: "rgba(255,77,106,0.07)", border: "1px solid rgba(255,77,106,0.18)", fontSize: 12.5, color: "var(--red)", ...style }}>
      <AlertTriangle size={12} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{msg}</span>
      <button className="g-icon-btn" style={{ padding: 3, color: "var(--red)" }} onClick={onClose}><X size={11} /></button>
    </div>
  );
}