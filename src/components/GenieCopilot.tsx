import { Bot, Clock, MessageSquare, Sparkles, Users, ChartColumn, Play, Database, Gauge, RefreshCw, TrendingUp, Shield, TriangleAlert } from "lucide-react";

const messages = [
  "Explain this issue",
  "Fix this",
  "Deploy to staging",
  "Deploy to production",
  "Show regressions after the latest release",
  "Which users are most affected?",
  "Generate tests for the fix",
];

const monitoring = [
    { icon: Clock, label: "Real-time issue detection" },
    { icon: Users, label: "Smart grouping" },
    { icon: ChartColumn, label: "Heatmaps & frequency charts" },
    { icon: Play, label: "User session replay" },
    { icon: Database, label: "Logs, stack traces, breadcrumbs" },
    { icon: Gauge, label: "API / DB / frontend performance" },
];

const automation = [
  { icon: RefreshCw, label: "Daily AI reports" },
  { icon: TrendingUp, label: "Regression detection" },
  { icon: ChartColumn, label: "Prioritization by impact" },
  { icon: Shield, label: "Noise cleanup" },
  { icon: Gauge, label: "Health scans" },
];



const GenieCopilot = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/50" id="geniecopilot">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 ring-1 ring-primary/30 text-sm text-primary mb-8">
            <Bot className="h-4 w-4" />
            AI-Assistant
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Genie <span className="genie-gradient-text">Copilot</span> 
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Your AI partner for debugging, maintenance and insight. Ask anything.
          </p>
        </div>

      {/* Grid 2x2 (1 coluna em mobile, 2 colunas em desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna 1 - Topo Esquerda (Mensagens) */}
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

        {/* Coluna 2 - Topo Direita (Chat) */}
        <div className="relative rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl genie-gradient-bg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold">Genie Copilot</div>
              <div className="text-xs text-muted-foreground">AI Assistant</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-1">You</div>
              <div className="text-sm">Explain why the payment API is failing</div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-sm text-primary mb-1">Genie</div>
              <div className="text-sm">
                The payment API is returning 429 due to rate limiting. The webhook handler is making duplicate calls...
              </div>
            </div>
          </div>
        </div>

        {/* Card Error Intelligence */}
      <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-sm text-destructive mb-6">
          <TriangleAlert className="h-4 w-4" />
          Monitoring
        </div>
        <h3 className="text-2xl font-bold mb-4">Error Intelligence</h3>
        <p className="text-muted-foreground mb-6">
          Deep visibility into every error affecting your users.
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

      {/* Card Automated Maintenance */}
      <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-sm text-success mb-6">
          <RefreshCw className="h-4 w-4" />
          Automation
        </div>
        <h3 className="text-2xl font-bold mb-4">Automated Maintenance</h3>
        <p className="text-muted-foreground mb-6">
          Proactive health monitoring and intelligent maintenance.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {automation.map(({ icon: Icon, label }, idx) => (
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

