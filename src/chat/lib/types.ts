export interface Attachment {
  id: string; name: string; type: "file" | "image";
  preview?: string;
  file?: File;
}
export interface FileDiffLine { content: string; type: "added" | "removed" | "context"; }
export interface FileChange {
  name: string; action: "created" | "modified" | "deleted";
  linesAdded?: number; linesRemoved?: number; diff?: FileDiffLine[];
  approved?: boolean | null;
  /** Raw original snippet (verbatim) used for surgical apply */
  originalContent?: string;
  /** Full replacement/new content used for apply */
  updatedContent?: string;
}
export interface ThinkingStep { label: string; status: "done" | "in_progress" | "pending"; detail?: string; }
export interface FileReadActivity { file: string; status: "reading" | "done"; lines?: number; }
export interface ChoiceOption { label: string; description?: string; }
export interface MessageAction {
  type: "approval" | "single-choice" | "multi-choice" | "suggestions" | "links" | "try-fix" | "tasks" | "deploy-checklist";
  options?: ChoiceOption[];
  links?: { label: string; url: string }[];
  suggestions?: string[];
  tasks?: { label: string; status: "done" | "in_progress" | "todo" }[];
  resolved?: string | string[];
  allowOther?: boolean;
}
export interface TokenUsage {
  promptTokens: number; completionTokens: number; totalTokens: number;
  costCents: number; tokensPerSecond?: number;
}
export interface Message {
  id: string; role: "user" | "assistant" | "system"; content: string; timestamp: Date;
  attachments?: Attachment[]; actions?: MessageAction[];
  isError?: boolean;
  thinking?: { summary: string; steps: ThinkingStep[]; duration?: string };
  fileChanges?: FileChange[]; fileReads?: FileReadActivity[];
  isReverted?: boolean; tokenUsage?: TokenUsage; isStreaming?: boolean;
  editedAt?: Date;
}
export interface Conversation {
  id: string; title: string; messages: Message[];
  createdAt: Date; updatedAt: Date; archived: boolean; pinned: boolean;
}
export interface Connection {
  id: string; category: string; providerId: string; providerName: string;
  label: string; status: "connected" | "error" | "connecting"; url?: string;
  meta?: Record<string, string>;
}
export interface Project {
  id: string; name: string; description?: string;
  connections: Connection[]; createdAt: string;
}
export interface GenieModel {
  id: string; label: string; tagline: string; badge?: string;
  apiModel: string; tier: "fast" | "pro" | "max";
  inputCostPer1M: number; outputCostPer1M: number;
  contextK: number;
}
export const MODELS: GenieModel[] = [
  { id: "genie-lite", label: "Genie Lite", tagline: "Quick answers, everyday tasks",    apiModel: "claude-haiku-4-5-20251001", tier: "fast", inputCostPer1M: 80,   outputCostPer1M: 400,  contextK: 200 },
  { id: "genie-pro",  label: "Genie Pro",  tagline: "Best balance for development",     apiModel: "claude-sonnet-4-20250514",  tier: "pro",  inputCostPer1M: 300,  outputCostPer1M: 1500, contextK: 200, badge: "Recommended" },
  { id: "genie-max",  label: "Genie Max",  tagline: "Maximum power for complex tasks",  apiModel: "claude-opus-4-20250514",    tier: "max",  inputCostPer1M: 1500, outputCostPer1M: 7500, contextK: 200 },
];
export interface SlashCommand { command: string; label: string; description: string; }
export const SLASH_CMDS: SlashCommand[] = [
  { command: "/fix",      label: "Fix Error",    description: "Detect & fix issues automatically" },
  { command: "/deploy",   label: "Deploy",        description: "Trigger deployment to production" },
  { command: "/optimize", label: "Optimize",      description: "Performance analysis & suggestions" },
  { command: "/test",     label: "Run Tests",     description: "Execute test suite & report" },
  { command: "/status",   label: "Status",        description: "Project status & recent changes" },
  { command: "/rollback", label: "Rollback",      description: "Revert to previous deployment" },
  { command: "/search",   label: "Search Code",   description: "Search across the entire codebase" },
  { command: "/explain",  label: "Explain",       description: "Explain selected code in detail" },
  { command: "/refactor", label: "Refactor",      description: "Suggest structural improvements" },
  { command: "/docs",     label: "Generate Docs", description: "Create documentation for code" },
  { command: "/review",   label: "Code Review",   description: "Full code review with suggestions" },
];
export const QUICK_ACTIONS = ["Fix a bug","Add a feature","Optimize performance","Review my code","Explain this error","Suggest refactors"];
export function buildSystemPrompt(project: Project | null): string {
  const base = "You are Genie, a world-class AI development assistant for existing products. You help engineers understand, evolve, and improve their codebase. Be precise, proactive, and conversational. Use markdown with fenced code blocks (with language tags). Keep answers focused and actionable.";
  if (!project) return base + "\n\nNo project connected. Answer freely.";
  const src = project.connections.find((c) => c.category === "source");
  const projectCtx = "\n\nACTIVE PROJECT: \"" + project.name + "\" — " + (src?.meta?.language ?? "TypeScript") + " " + (src?.meta?.role ?? "fullstack") + " with " + project.connections.length + " active integrations.";
  const codeEngineInstructions = `

CODE ENGINE ACTIVE — you have two tools: list_files and read_file.

When asked to make changes:
1. Use read_file to read relevant files first (always read before modifying).
2. Write a brief natural-language explanation of each change.
3. For every file change, emit an XML block AFTER the explanation using this exact format:

To MODIFY an existing file:
<genie_change file="path/to/file.ts" action="modified">
<original>
(EXACT verbatim text from the file to replace — copy it character-for-character)
</original>
<updated>
(the replacement text)
</updated>
</genie_change>

To CREATE a new file:
<genie_change file="path/to/new.ts" action="created">
<content>
(full file content)
</content>
</genie_change>

To DELETE a file:
<genie_change file="path/to/file.ts" action="deleted"/>

Rules:
- The <original> block must be verbatim text taken directly from the file (exact indentation, whitespace, newlines).
- Be surgical: only change what is necessary, keep all surrounding code intact.
- You may emit multiple <genie_change> blocks per response.
- After the blocks, briefly tell the user what to review.`;
  return base + projectCtx + codeEngineInstructions;
}
export interface ApiMessage { role: "user" | "assistant"; content: string; }
export function buildHistory(msgs: Message[]): ApiMessage[] {
  return msgs.filter((m) => (m.role === "user" || m.role === "assistant") && !m.isReverted).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
}
export function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}
export function formatTokens(n: number): string { return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString(); }
export function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }
export function autoTitle(content: string): string {
  const clean = content.replace(/^\/\w+\s*/, "").trim();
  return clean.length > 45 ? clean.slice(0, 42) + "…" : clean;
}