import { Bot, TrendingUpIcon, GraduationCap, Lock, CircleCheckBig, GitPullRequest, BrushCleaning, Globe, RefreshCcw, Clock, MessageSquare, Sparkles, ChartColumn, Database, Gauge, Shield, Zap, Code, TriangleAlert, Rocket, Brain } from "lucide-react";

const messages = [
  "Add a dark mode toggle to the settings page",
  "Fix the checkout error users reported yesterday",
  "Optimize the dashboard loading speed — it feels slow",
  "Generate a summary of all changes made since the last release",
  "Refactor the auth flow to make it more secure and easier to maintain"
];

const evolution = [
    { icon: Code, label: "New features on demand" },
    { icon: RefreshCcw, label: "Refactoring & cleanup" },
    { icon: BrushCleaning, label: "UI & design updates" },
    { icon: Database, label: "Backend & API changes" },
    { icon: Globe, label: "Full-stack modifications" },
    { icon: Gauge, label: "Performance optimization" },
];

const monitoring = [
  { icon: TriangleAlert, label: "Real-time bug detection" },
  { icon: RefreshCcw, label: "Auto-repair suggestions" },
  { icon: ChartColumn, label: "Performance monitoring" },
  { icon: Shield, label: "Security vulnerability alerts" },
  { icon: Clock, label: "24/7 continuous logging" },
];

const safepipeline = [
  { icon: Code, label: "Full diff preview" },
  { icon: Shield, label: "Impact & risk analysis" },
  { icon: GitPullRequest, label: "Explicit approval required" },
  { icon: CircleCheckBig, label: "Auto PR creation" },
  { icon: Rocket, label: "Staged deployment" },
];

const learning = [
  { icon: Database, label: "Persistent project memory" },
  { icon: TrendingUpIcon, label: "Pattern recognition" },
  { icon: RefreshCcw, label: "Learns from your decisions" },
  { icon: Clock, label: "Historical context" },
  { icon: Brain, label: "Architecture awareness" },
];



const GenieCopilot = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/50" id="geniecopilot">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 ring-1 ring-primary/30 text-sm text-primary mb-8">
            <Bot className="h-4 w-4" />
            AI Copilot
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Genie <span className="genie-gradient-text">Copilot</span> 
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            Your AI dev team that knows every file, function, and dependency in your project.<br />
            Request changes, evolve your architecture, improve your code — all in natural language.
          </p>
        </div>

      {/* Grid com 6 cards (1 coluna em mobile, 2 colunas em desktop) */}
      <div className="grid grid-flow-col grid-rows-6 gap-4">
        {/* Card 1 - Topo Esquerda (Mensagens) */}
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
            >
              <MessageSquare className="h-4 w-4 text-primary shrink-0" />
              <code className="text-sm font-mono">{`"${msg}"`}</code>
            </div>
          ))}
        </div>

        {/* Card 2 - Topo Direita (Chat) */}
        <div className="relative rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl genie-gradient-bg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold">Genie Copilot</div>
              <div className="text-xs text-muted-foreground">AI Copilot</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">You</div>
              <div className="text-sm">Add a dark mode toggle to the settings page</div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-sm text-primary mb-1">Genie</div>
              <div className="text-sm">
                Done. I&apos;ve added a dark mode toggle to your settings page. 3 files changed — here&apos;s the preview. Approve when ready.
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Evolution */}
        <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <Zap className="h-4 w-4" />
            Evolution
          </div>
          <h3 className="text-2xl font-bold mb-4">Code Evolution</h3>
          <p className="text-muted-foreground mb-6">
            Request any change — new features, refactoring, UI updates, API changes — and Genie delivers production-ready code.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {evolution.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4 - Monitoring */}
        <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm text-success mb-6">
            <Shield className="h-4 w-4" />
            Monitoring
          </div>
          <h3 className="text-2xl font-bold mb-4">Bug Fixing &amp; Monitoring</h3>
          <p className="text-muted-foreground mb-6">
            Genie detects bugs, performance issues, and vulnerabilities 24/7. Suggests and applies safe fixes automatically.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {monitoring.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 5 - Safe Pipeline */}
        <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-sm text-warning mb-6">
            <Lock className="h-4 w-4" />
            Safe Pipeline
          </div>
          <h3 className="text-2xl font-bold mb-4">Safe Change Pipeline</h3>
          <p className="text-muted-foreground mb-6">
            Every change follows a strict preview → approve → merge flow. Nothing touches your code without your OK.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {safepipeline.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6 - Learning */}
        <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <GraduationCap className="h-4 w-4" />
            Learning
          </div>
          <h3 className="text-2xl font-bold mb-4">Continuous Learning</h3>
          <p className="text-muted-foreground mb-6">
            Genie builds a deep, persistent understanding of your project that gets smarter with every interaction.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {learning.map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>   

      </div>    
    </div>      
  </section>
  );
}

export default GenieCopilot;

