# Genie Chat — Usage Guide

Drop-in AI dev assistant for Next.js. Reads your codebase, generates diffs, applies changes to disk, opens GitHub PRs and triggers Vercel deploys.

---

## Setup

Add to `.env.local`:

```env
# Required
ANTHROPIC_KEY=sk-ant-…
PROJECT_PATH=/absolute/path/to/your/repo

# Optional — GitHub PR creation
GITHUB_TOKEN=ghp_…
GITHUB_OWNER=your-username
GITHUB_REPO=repo-name

# Optional — Vercel deploy
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/…
```

---

## Embedding

```tsx
import ChatPanel from "@/chat/components/ChatPanel";

// Free-form assistant (no project)
<ChatPanel />

// With a connected project (code engine active)
<ChatPanel
  hasProject
  project={{
    id: "proj-1",
    name: "My App",
    connections: [
      {
        id: "src",
        category: "source",
        providerId: "github",
        providerName: "GitHub",
        label: "main",
        status: "connected",
        meta: { language: "TypeScript", role: "fullstack" },
      },
    ],
    createdAt: new Date().toISOString(),
  }}
  onConnectProject={() => {/* open connection modal */}}
/>
```

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | Streams Claude responses. Pass `enableCodeEngine: true` to activate the tool-use loop. |
| `/api/codebase` | GET | Returns the project file tree. `?path=src/foo.ts` returns file content. |
| `/api/apply` | POST | Applies approved `FileChange[]` to disk (create / modify / delete). |
| `/api/github` | POST | Creates a branch, commits all approved changes, opens a GitHub Pull Request. |
| `/api/deploy` | POST | Triggers the Vercel deploy hook. Optionally polls for deployment URL. |

---

## Full Change Flow

```
1. User sends a message
      ↓
2. Claude calls list_files + read_file (tool-use loop, up to 8 iterations)
      ↓  UI shows "x files read" in a collapsible FileReadBlock
3. Claude returns explanation + <genie_change> XML blocks
      ↓  engine.ts parses blocks; ChatPanel strips them from displayed text
      ↓  UI renders diff cards (CodeDiffBlock) with +/- line counts
4. User clicks ✓ on each diff card
      ↓  POST /api/apply writes files to disk
5. "Open PR (n)" button appears in header
      ↓  POST /api/github → branch genie/… + commit + PR
6. "Deploy" button appears after PR is created
      ↓  POST /api/deploy → Vercel build triggered
```

---

## `<genie_change>` XML Format

Claude wraps every file change in XML. `engine.ts` parses and strips these blocks before the message bubble is rendered.

**Modify an existing file** — `<original>` must be verbatim text copied from the file:

```xml
<genie_change file="src/app/page.tsx" action="modified">
  <original>
  export default function Page() {
    return <main>Hello</main>;
  }
  </original>
  <updated>
  export default function Page() {
    return <main className="p-8">Hello, World!</main>;
  }
  </updated>
</genie_change>
```

**Create a new file:**

```xml
<genie_change file="src/lib/utils.ts" action="created">
  <content>
  export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
  }
  </content>
</genie_change>
```

**Delete a file:**

```xml
<genie_change file="src/lib/legacy.ts" action="deleted"/>
```

---

## Models

| ID | Label | Model | Best for |
|---|---|---|---|
| `genie-fast` | Genie Fast | claude-haiku-4-5 | Quick answers, everyday tasks |
| `genie-pro` | Genie Pro | claude-sonnet-4 | Development tasks (recommended) |
| `genie-max` | Genie Max | claude-opus-4 | Complex refactors, architecture decisions |

---

## Preview Panel

Click the **⊟ panel icon** in the header to open a split view: chat on the left, live iframe on the right.

Auto-refreshes after changes are applied to disk. Default URL: `http://localhost:3000`.

Viewport switcher: **Desktop** · **Tablet (768 px)** · **Mobile (390 px)**

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `⌘N` / `Ctrl+N` | New conversation |
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `↑` (empty input) | Edit last user message |
| `/` | Open slash commands |
| `Esc` | Close palette / menus |

---

## Slash Commands

| Command | Description |
|---|---|
| `/fix` | Detect & fix issues automatically |
| `/optimize` | Performance analysis & suggestions |
| `/refactor` | Suggest structural improvements |
| `/test` | Execute test suite & report |
| `/review` | Full code review with suggestions |
| `/explain` | Explain selected code in detail |
| `/docs` | Generate documentation |
| `/deploy` | Trigger deployment |
| `/rollback` | Revert to previous deployment |
| `/status` | Project status & recent changes |
| `/search` | Search across the codebase |

---

## Features

### Core
- [x] Claude API streaming (SSE) with tool-use loop
- [x] Multi-model — Fast / Pro / Max
- [x] Code engine — reads files, generates diffs, applies to disk
- [x] GitHub PR creation (branch → commit → PR)
- [x] Vercel deploy trigger + status polling

### Messages
- [x] Streaming with dot-loader before first chunk
- [x] Inline edit → re-sends from that point
- [x] Retry last assistant message
- [x] Revert to any point in history
- [x] Per-message token count + cost + tokens/sec (on hover)
- [x] Copy, thumbs up/down feedback

### Code & Diffs
- [x] Syntax highlighting via shiki (TS/JS/TSX/Python/Go/Rust/CSS/JSON/Shell/YAML…)
- [x] `<genie_change>` parser with LCS line diff
- [x] CodeDiffBlock — expand, approve ✓ / reject ✗ per file
- [x] Surgical apply (only replaces the matched original snippet)

### Files & Attachments
- [x] Drag & drop anywhere on panel
- [x] Image thumbnail preview
- [x] File attach menu (file, image, screenshot, folder, code snippet, URL)

### Navigation
- [x] ⌘K command palette (fuzzy search, keyboard nav)
- [x] Conversation sidebar (pin, archive, delete)
- [x] Smart scroll — pauses on scroll-up, resumes automatically

### UI
- [x] Split layout — chat + live preview iframe
- [x] Glassmorphism + noise texture + radial gradient
- [x] Context window bar (color-coded)
- [x] Live connection pulsing badge
- [x] Toast notifications (success / error / info / warning)
- [x] localStorage persistence with hydration guard

---

## File Structure

```
chat/
├── index.ts                     ← main export
├── Usage.md                     ← this file
├── lib/
│   ├── types.ts                 ← types, models, constants, helpers, buildSystemPrompt
│   └── engine.ts                ← <genie_change> parser + LCS line diff
├── hooks/
│   ├── useClaudeStream.ts       ← streaming SSE hook (handles x-file-read events)
│   ├── usePersistence.ts        ← localStorage conversations
│   └── useDragDrop.ts           ← drag & drop file attach
├── styles/tokens.ts             ← all CSS (self-contained, no Tailwind required)
└── components/
    ├── ChatPanel.tsx            ← main component — use this
    ├── PreviewPanel.tsx         ← live iframe preview with viewport switcher
    ├── MessageBubble.tsx        ← messages, edit/retry inline
    ├── InputBox.tsx             ← textarea + model selector + slash menu
    ├── Prose.tsx                ← markdown renderer
    ├── CodeBlock.tsx            ← syntax highlighted code (shiki)
    ├── CommandPalette.tsx       ← ⌘K palette
    ├── ConvSidebar.tsx          ← conversation history sidebar
    ├── EmptyState.tsx           ← animated empty state
    ├── DropZoneOverlay.tsx      ← drag & drop full-panel overlay
    ├── Primitives.tsx           ← Avatar, DotLoader, ContextBar, CodeDiffBlock…
    └── Toast.tsx                ← toast notifications
```
