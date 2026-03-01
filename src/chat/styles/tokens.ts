export const GLOBAL_STYLES = `

  :root {
    --bg:          #07070a;
    --bg-mesh:     radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,60,255,0.13) 0%, transparent 60%),
                   radial-gradient(ellipse 60% 40% at 80% 110%, rgba(0,190,255,0.08) 0%, transparent 55%),
                   radial-gradient(ellipse 40% 30% at 50% 50%, rgba(180,80,255,0.04) 0%, transparent 70%);
    --surface:     rgba(255,255,255,0.035);
    --surface-2:   rgba(255,255,255,0.055);
    --surface-3:   rgba(255,255,255,0.08);
    --glass:       rgba(10,10,18,0.75);
    --glass-2:     rgba(15,15,25,0.85);
    --border:      rgba(255,255,255,0.07);
    --border-2:    rgba(255,255,255,0.12);
    --border-glow: rgba(99,60,255,0.3);
    --text:        #f0eefc;
    --text-2:      #8e8ca4;
    --text-3:      #5e5c78;
    --text-dim:    rgba(240,238,252,0.4);

    --p:           #7c5cff;
    --p-light:     #a78bfa;
    --p-dark:      #5b3dd4;
    --p-glow:      rgba(124,92,255,0.2);
    --p-glow-2:    rgba(124,92,255,0.08);
    --cyan:        #00d4ff;
    --cyan-glow:   rgba(0,212,255,0.15);
    --green:       #00e5a0;
    --green-glow:  rgba(0,229,160,0.15);
    --red:         #ff4d6a;
    --red-glow:    rgba(255,77,106,0.15);
    --amber:       #ffb340;
    --amber-glow:  rgba(255,179,64,0.15);

    --font:        'DM Sans', system-ui, sans-serif;
    --serif:       'Instrument Serif', Georgia, serif;
    --mono:        'DM Mono', 'Fira Code', monospace;

    --r-sm:  6px;
    --r:     10px;
    --r-lg:  14px;
    --r-xl:  18px;
    --r-2xl: 24px;
    --r-full: 9999px;

    --shadow-sm:  0 1px 2px rgba(0,0,0,0.5);
    --shadow:     0 4px 16px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.6);
    --shadow-lg:  0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4);
    --shadow-glow: 0 0 0 1px var(--border-glow), 0 8px 32px rgba(124,92,255,0.15);

    --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
    --ease-out:    cubic-bezier(0.16,1,0.3,1);
    --ease-in-out: cubic-bezier(0.65,0,0.35,1);
  }

  /* ---- Reset & Base ---- */
  .genie * { box-sizing: border-box; margin: 0; padding: 0; }
  .genie {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow: hidden;
  }

  /* ---- Noise Texture Overlay ---- */
  .genie::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  /* ---- Mesh Background ---- */
  .genie-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: var(--bg-mesh);
  }

  /* ---- Scrollbar ---- */
  .g-scroll { scrollbar-width: thin; scrollbar-color: rgba(124,92,255,0.15) transparent; }
  .g-scroll::-webkit-scrollbar { width: 3px; }
  .g-scroll::-webkit-scrollbar-track { background: transparent; }
  .g-scroll::-webkit-scrollbar-thumb { background: rgba(124,92,255,0.2); border-radius: 2px; }

  /* ---- Typography ---- */
  .g-serif { font-family: var(--serif); }
  .g-mono  { font-family: var(--mono); }

  /* ---- Glass morphism ---- */
  .g-glass {
    background: var(--glass);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border: 1px solid var(--border);
  }
  .g-glass-2 {
    background: rgba(14,13,22,0.96);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border: 1px solid var(--border-2);
  }

  /* ---- Prose ---- */
  .g-prose { font-size: 14px; line-height: 1.75; color: var(--text); }
  .g-prose p { margin-bottom: 10px; }
  .g-prose p:last-child { margin-bottom: 0; }
  .g-prose h1,.g-prose h2,.g-prose h3 { font-weight: 600; line-height: 1.3; margin: 18px 0 8px; color: var(--text); }
  .g-prose h1 { font-size: 22px; font-family: var(--serif); font-style: italic; }
  .g-prose h2 { font-size: 17px; }
  .g-prose h3 { font-size: 14.5px; color: var(--text-2); }
  .g-prose strong { font-weight: 600; color: var(--text); }
  .g-prose em { color: var(--text-2); font-style: italic; }
  .g-prose ul,.g-prose ol { padding-left: 18px; margin: 6px 0; }
  .g-prose li { margin: 4px 0; }
  .g-prose a { color: var(--p-light); text-decoration: none; border-bottom: 1px solid rgba(167,139,250,0.3); transition: border-color 0.15s; }
  .g-prose a:hover { border-color: var(--p-light); }
  .g-prose blockquote { border-left: 2px solid var(--p); padding: 4px 0 4px 16px; margin: 10px 0; color: var(--text-2); font-style: italic; }
  .g-prose hr { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
  .g-prose code {
    font-family: var(--mono); font-size: 12.5px;
    padding: 2px 7px; border-radius: 5px;
    background: rgba(124,92,255,0.1); color: var(--p-light);
    border: 1px solid rgba(124,92,255,0.2);
  }
  .g-prose pre {
    margin: 12px 0; border-radius: var(--r-lg); overflow: hidden;
    background: rgba(0,0,0,0.4); border: 1px solid var(--border-2);
    box-shadow: var(--shadow-sm);
  }
  .g-prose pre code { background: none; border: none; padding: 0; color: var(--text); font-size: 13px; }
  .g-prose pre > div { padding: 16px 18px; overflow-x: auto; }
  .g-prose table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  .g-prose th,.g-prose td { padding: 8px 14px; border: 1px solid var(--border); text-align: left; }
  .g-prose th { background: var(--surface-2); font-weight: 600; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-2); }

  /* ---- Animations ---- */
  @keyframes g-up     { from { opacity:0; transform:translateY(12px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes g-in     { from { opacity:0; } to { opacity:1; } }
  @keyframes g-down   { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes g-scale  { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
  @keyframes g-slide-r{ from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
  @keyframes g-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes g-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes g-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.95)} }
  @keyframes g-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes g-shimmer{ 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes g-glow-pulse { 0%,100%{box-shadow:0 0 20px var(--p-glow)} 50%{box-shadow:0 0 40px rgba(124,92,255,0.4), 0 0 80px rgba(124,92,255,0.15)} }
  @keyframes g-orbit  { from{transform:rotate(0deg) translateX(18px) rotate(0deg)} to{transform:rotate(360deg) translateX(18px) rotate(-360deg)} }
  @keyframes g-logo-breathe {
    0%,100% { transform:scale(1);    filter:drop-shadow(0 0 6px rgba(124,92,255,0.5))  drop-shadow(0 2px 6px rgba(0,0,0,0.5)); }
    50%     { transform:scale(1.07); filter:drop-shadow(0 0 18px rgba(124,92,255,0.9)) drop-shadow(0 4px 10px rgba(0,0,0,0.4)); }
  }
  @keyframes g-halo-pulse {
    0%,100% { opacity:0.45; transform:scale(1); }
    50%     { opacity:0.75; transform:scale(1.08); }
  }
  @keyframes g-wave   { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
  @keyframes g-token-count { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes g-ctx-fill { from{width:0} to{width:var(--fill-w)} }

  .a-up       { animation: g-up 0.28s var(--ease-out) both; }
  .a-in       { animation: g-in 0.18s ease both; }
  .a-down     { animation: g-down 0.22s var(--ease-out) both; }
  .a-scale    { animation: g-scale 0.22s var(--ease-spring) both; }
  .a-slide-r  { animation: g-slide-r 0.25s var(--ease-out) both; }
  .a-spin     { animation: g-spin 0.75s linear infinite; }
  .a-pulse    { animation: g-pulse 2s ease infinite; }
  .a-glow     { animation: g-glow-pulse 3s ease infinite; }

  /* ---- Input ---- */
  .g-input-wrap {
    background: var(--glass);
    backdrop-filter: blur(24px) saturate(1.5);
    -webkit-backdrop-filter: blur(24px) saturate(1.5);
    border: 1px solid var(--border-2);
    border-radius: var(--r-xl);
    transition: border-color 0.25s, box-shadow 0.25s;
    position: relative;
  }
  .g-input-wrap::before {
    content: '';
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(124,92,255,0.06), transparent);
    pointer-events: none;
    transition: opacity 0.3s;
    opacity: 0;
  }
  .g-input-wrap.focused { border-color: rgba(124,92,255,0.4); box-shadow: 0 0 0 3px rgba(124,92,255,0.08), var(--shadow); }
  .g-input-wrap.focused::before { opacity: 1; }
  .g-input-wrap.loading { border-color: rgba(0,212,255,0.3); box-shadow: 0 0 0 3px rgba(0,212,255,0.06), var(--shadow); }
  .g-input-wrap.loading::before { background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,212,255,0.05), transparent); opacity: 1; }

  .g-textarea {
    resize: none; outline: none; border: none; background: transparent;
    width: 100%; color: var(--text); font-family: var(--font); font-size: 14.5px;
    line-height: 1.65; caret-color: var(--p-light); position: relative; z-index: 1;
  }
  .g-textarea::placeholder { color: var(--text-2); opacity: 0.5; }

  /* ---- Buttons ---- */
  .g-btn-send {
    background: linear-gradient(135deg, var(--p-dark) 0%, var(--p) 50%, var(--p-light) 100%);
    box-shadow: 0 2px 12px rgba(124,92,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: transform 0.15s var(--ease-spring), box-shadow 0.2s;
    cursor: pointer; border: none; color: #fff;
  }
  .g-btn-send:hover:not(:disabled) {
    transform: scale(1.07) translateY(-1px);
    box-shadow: 0 4px 20px rgba(124,92,255,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .g-btn-send:active:not(:disabled) { transform: scale(0.96); }
  .g-btn-send:disabled { background: var(--surface-2); box-shadow: none; cursor: not-allowed; }

  .g-icon-btn {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: var(--r); padding: 7px; color: var(--text-2);
    transition: color 0.15s, background 0.15s, transform 0.15s;
    cursor: pointer; border: none; background: transparent;
  }
  .g-icon-btn:hover { color: var(--text); background: var(--surface-2); transform: scale(1.05); }
  .g-icon-btn.active { color: var(--p-light); background: var(--p-glow-2); }
  .g-icon-btn.danger:hover { color: var(--red); background: var(--red-glow); }

  /* ---- Chip ---- */
  .g-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--r-full);
    border: 1px solid var(--border-2); color: var(--text-2);
    font-size: 12.5px; cursor: pointer; background: var(--surface);
    font-family: var(--font); transition: all 0.18s var(--ease-out);
    backdrop-filter: blur(8px);
  }
  .g-chip:hover {
    color: var(--text); border-color: rgba(124,92,255,0.4);
    background: var(--p-glow-2); transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124,92,255,0.1);
  }

  /* ---- Streaming cursor ---- */
  .g-cursor {
    display: inline-block; width: 7px; height: 16px;
    background: linear-gradient(180deg, var(--p-light), var(--p));
    border-radius: 2px; margin-left: 2px; vertical-align: middle;
    animation: g-blink 0.85s step-start infinite;
    box-shadow: 0 0 8px var(--p-glow);
  }

  /* ---- Context bar ---- */
  .g-ctx-bar {
    height: 2px; border-radius: 2px; overflow: hidden;
    background: var(--surface-3);
  }
  .g-ctx-bar-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--p), var(--cyan));
    transition: width 0.8s var(--ease-out);
  }

  /* ---- Waveform bars ---- */
  .g-wave-bar {
    width: 3px; border-radius: 3px; background: var(--p-light);
    transform-origin: bottom;
  }

  /* ---- User bubble ---- */
  .g-user-bubble {
    background: linear-gradient(135deg, rgba(124,92,255,0.14), rgba(93,60,210,0.08));
    border: 1px solid rgba(124,92,255,0.18);
    border-radius: 18px 18px 4px 18px;
  }

  /* ---- Genie avatar ---- */
  .g-avatar {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(124,92,255,0.3), rgba(0,212,255,0.15));
    border: 1px solid rgba(124,92,255,0.25);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 12px rgba(124,92,255,0.2);
  }

  /* ---- Diff ---- */
  .g-diff-add { background: rgba(0,229,160,0.06); border-left: 2px solid var(--green); }
  .g-diff-del { background: rgba(255,77,106,0.06); border-left: 2px solid var(--red); }
  .g-diff-ctx { border-left: 2px solid transparent; }

  /* ---- Command palette ---- */
  .g-palette {
    background: var(--glass-2);
    backdrop-filter: blur(40px) saturate(1.8);
    -webkit-backdrop-filter: blur(40px) saturate(1.8);
    border: 1px solid var(--border-2);
    border-radius: var(--r-xl);
    box-shadow: var(--shadow-lg), 0 0 0 1px rgba(0,0,0,0.5);
  }

  /* ---- Token shimmer ---- */
  .g-token-shimmer {
    background: linear-gradient(90deg, var(--text-3) 0%, var(--text-2) 50%, var(--text-3) 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: g-shimmer 1.5s linear infinite;
  }

  /* ---- Sidebar ---- */
  .g-sidebar {
    background: var(--glass-2);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border-right: 1px solid var(--border);
  }

  /* ---- Tooltip ---- */
  .g-tooltip { position: relative; }
  .g-tooltip:hover::after {
    content: attr(data-tip);
    position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
    background: var(--surface-3); color: var(--text-2); border: 1px solid var(--border-2);
    padding: 4px 9px; border-radius: 6px; font-size: 11px; white-space: nowrap;
    pointer-events: none; z-index: 200; box-shadow: var(--shadow-sm);
    animation: g-in 0.1s ease both;
  }

  /* ---- Badge ---- */
  .g-badge-new  { background: rgba(0,229,160,0.1); color: var(--green); border: 1px solid rgba(0,229,160,0.2); }
  .g-badge-edit { background: rgba(0,212,255,0.1); color: var(--cyan); border: 1px solid rgba(0,212,255,0.2); }
  .g-badge-del  { background: rgba(255,77,106,0.1); color: var(--red); border: 1px solid rgba(255,77,106,0.2); }

  /* ---- Attachment pill ---- */
  .g-attach-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px; border-radius: var(--r); background: var(--surface-2);
    border: 1px solid var(--border-2); font-size: 12px;
    transition: border-color 0.15s;
  }
  .g-attach-pill:hover { border-color: var(--border-glow); }

  /* ---- Thinking block ---- */
  .g-thinking-line { border-left: 1.5px solid rgba(124,92,255,0.18); margin-left: 12px; padding-left: 14px; }

  /* ---- Loader ---- */
  .g-dot-loader span {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--p-light); display: inline-block;
  }
  .g-dot-loader span:nth-child(1) { animation: g-bounce 0.9s ease 0s infinite; }
  .g-dot-loader span:nth-child(2) { animation: g-bounce 0.9s ease 0.15s infinite; }
  .g-dot-loader span:nth-child(3) { animation: g-bounce 0.9s ease 0.3s infinite; }

  /* ---- Model selector ---- */
  .g-model-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 11px 5px 8px; border-radius: var(--r-full);
    border: 1px solid var(--border-2); background: var(--surface);
    cursor: pointer; font-size: 12px; font-weight: 500; color: var(--text-2);
    font-family: var(--font); transition: all 0.18s;
    backdrop-filter: blur(8px);
  }
  .g-model-btn:hover { border-color: rgba(124,92,255,0.35); color: var(--text); background: var(--p-glow-2); }

  /* ---- Status dot ---- */
  .g-status-live {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 0 rgba(0,229,160,0.4);
    animation: g-status-ping 2.5s ease infinite;
  }
  @keyframes g-status-ping {
    0% { box-shadow: 0 0 0 0 rgba(0,229,160,0.4); }
    70% { box-shadow: 0 0 0 6px rgba(0,229,160,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,229,160,0); }
  }

  /* ---- Empty state orbit ---- */
  .g-orbit-dot {
    position: absolute; width: 5px; height: 5px; border-radius: 50%;
    background: var(--p-light); top: 50%; left: 50%; margin: -2.5px;
  }
  .g-orbit-dot:nth-child(1) { animation: g-orbit 3s linear infinite; opacity: 0.9; }
  .g-orbit-dot:nth-child(2) { animation: g-orbit 3s linear 1s infinite; opacity: 0.5; background: var(--cyan); }
  .g-orbit-dot:nth-child(3) { animation: g-orbit 3s linear 2s infinite; opacity: 0.3; background: var(--green); }

  /* ---- Shiki overrides — remove shiki's bg so ours shows ---- */
  .g-shiki { background: transparent !important; }
  .g-shiki span { font-family: var(--mono) !important; }

  /* ================================================================
     MOBILE — ≤ 640 px
  ================================================================ */
  @keyframes g-sheet-up {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .g-sidebar-handle { display: none; }

  @media (max-width: 640px) {
    /* -- Bottom sheet sidebar -- */
    .g-sidebar {
      position: fixed !important;
      inset: auto !important;
      left: 0 !important; right: 0 !important;
      bottom: 0 !important; top: auto !important;
      width: 100% !important;
      height: 88vh;
      border-radius: var(--r-2xl) var(--r-2xl) 0 0 !important;
      border-right: none !important;
      border-top: 1px solid var(--border-2) !important;
      animation: g-sheet-up 0.32s var(--ease-out) both !important;
    }
    .g-sidebar-handle {
      display: block;
      width: 36px; height: 4px; border-radius: 2px;
      background: var(--text-3); margin: 10px auto 0;
      flex-shrink: 0;
    }

    /* -- Input area safe area (iOS notch / home indicator) -- */
    .g-input-area {
      padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
    }

    /* -- Compact chat header -- */
    .g-chat-header { height: 48px !important; }

    /* -- Hide desktop-only tooltips on touch -- */
    .g-tooltip:hover::after { display: none; }

    /* -- Full-width message bubbles -- */
    .g-user-bubble { max-width: 90% !important; }

    /* -- Tighter message list padding -- */
    .g-msg-list { padding: 16px 12px 10px !important; }

    /* -- Font size bump for readability on small screens -- */
    .g-prose { font-size: 15px !important; }
    .g-textarea { font-size: 16px !important; } /* prevents iOS auto-zoom */
  }
`;