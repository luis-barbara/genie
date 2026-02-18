import { Sparkles, Eye, Bot, Type, Paintbrush, Shield, Check, Send, Zap, Users, Lock } from "lucide-react";

const DashboardPreview = () => {
  return (
    <div className="mt-20 max-w-6xl mx-auto">
      <div className="relative">
        {/* Glow effect behind dashboard */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl scale-95" />
        
        <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-2 shadow-2xl shadow-primary/10">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/50"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-warning/50"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-success/50"></div>
            </div>
            <div className="flex-1 mx-2">
              <div className="h-5 rounded-md bg-secondary/40 flex items-center justify-center">
                <span className="text-[9px] text-muted-foreground/40 font-mono">genie.dev/project/my-saas-app</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-5 px-2 rounded bg-primary/10 border border-primary/20 flex items-center gap-1">
                <Eye className="h-2.5 w-2.5 text-primary" />
                <span className="text-[9px] text-primary font-medium">Preview Mode</span>
              </div>
            </div>
          </div>
          <div className="rounded-b-xl bg-genie-surface overflow-hidden">
            <div className="flex min-h-[420px]">
              <div className="w-64 lg:w-72 border-r border-border/30 flex-col bg-card/30 hidden md:flex">
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/20">
                  <div className="h-5 w-5 rounded-md genie-gradient-bg flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground/80">Genie</span>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[8px] text-success/70">Online</span>
                  </div>
                </div>
                <div className="flex-1 p-3 space-y-3 overflow-hidden">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/30 border border-border/20">
                      <Eye className="h-2 w-2 text-muted-foreground/40" />
                      <span className="text-[8px] text-muted-foreground/40">Connected: my-saas-app</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[90%] rounded-xl rounded-br-sm bg-primary/15 border border-primary/20 px-3 py-2">
                      <div className="text-[10px] text-foreground/80 leading-relaxed">Change the hero headline to &quot;Ship 10x faster&quot; and make the CTA button green</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-5 rounded-md genie-gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="rounded-xl rounded-bl-sm bg-secondary/30 border border-border/20 px-3 py-2">
                        <div className="text-[10px] text-foreground/70 leading-relaxed mb-2">Done! I&apos;ve updated the headline and CTA. Preview is ready on the right →</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Type className="h-2.5 w-2.5 text-primary/60" />
                            <span className="text-[9px] text-foreground/50">Headline → &quot;Ship 10x faster&quot;</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Paintbrush className="h-2.5 w-2.5 text-primary/60" />
                            <span className="text-[9px] text-foreground/50">CTA color → green</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/15">
                          <Shield className="h-2.5 w-2.5 text-success/60" />
                          <span className="text-[8px] text-success/60">Safe • 1 file changed</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="h-6 px-3 rounded-md genie-gradient-bg flex items-center gap-1 cursor-default shadow-md shadow-primary/20">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                          <span className="text-[9px] font-medium text-primary-foreground">Approve</span>
                        </div>
                        <div className="h-6 px-2.5 rounded-md border border-border/30 bg-secondary/20 flex items-center gap-1 cursor-default">
                          <Eye className="h-2.5 w-2.5 text-muted-foreground/50" />
                          <span className="text-[9px] text-muted-foreground/50">View Diff</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/30 bg-secondary/10">
                    <span className="text-[10px] text-muted-foreground/30 flex-1">Describe a change...</span>
                    <div className="h-5 w-5 rounded-md genie-gradient-bg flex items-center justify-center">
                      <Send className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-background/40">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground/50 font-mono">my-saas-app.com</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/20">Preview — not yet applied</span>
                  </div>
                </div>
                <div className="bg-[hsl(220_25%_10%)]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[hsl(220_20%_15%)]">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-md bg-[hsl(200_80%_55%/0.3)]"></div>
                      <span className="text-[11px] font-bold text-foreground/70">MySaaS</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-[9px] text-muted-foreground/40">Features</span>
                      <span className="text-[9px] text-muted-foreground/40">Pricing</span>
                      <span className="text-[9px] text-muted-foreground/40">Docs</span>
                      <div className="h-5 px-2.5 rounded-md bg-[hsl(200_80%_55%/0.2)] flex items-center">
                        <span className="text-[8px] text-[hsl(200_80%_65%)]">Get Started</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-8 text-center">
                    <div className="relative inline-block mb-3">
                      <div 
                        className="absolute -inset-1.5 rounded-lg bg-cyan-500/10" 
                        style={{ border: '2px dashed rgba(103, 232, 249, 0.4)' }}
                      ></div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground whitespace-nowrap z-10">
                        <Sparkles className="h-2 w-2" />
                        <span className="text-[7px] font-semibold">Changed by Genie</span>
                      </div>
                      <h2 className="relative text-xl lg:text-2xl font-bold text-foreground/90 px-3 py-1">Ship 10x faster</h2>
                    </div>
                    <div className="text-[10px] text-muted-foreground/40 mb-5 max-w-[240px] mx-auto leading-relaxed">The modern platform for teams that build, deploy, and iterate without friction.</div>
                    <div className="relative inline-block">
                      <div 
                        className="absolute -inset-1.5 rounded-lg bg-green-500/10" 
                        style={{ border: '2px dashed rgba(134, 239, 172, 0.4)' }}
                      ></div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-success text-success-foreground whitespace-nowrap z-10">
                        <Paintbrush className="h-2 w-2" />
                        <span className="text-[7px] font-semibold">Color updated</span>
                      </div>
                      <div className="relative h-7 px-5 rounded-md bg-success/80 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-success-foreground">Start Free Trial</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-[hsl(220_20%_12%)] border border-[hsl(220_20%_16%)] p-3 text-center">
                        <Zap className="h-4 w-4 mx-auto mb-1.5 text-[hsl(200_80%_55%/0.5)]" />
                        <div className="text-[9px] font-semibold text-foreground/60 mb-0.5">Lightning Fast</div>
                        <div className="text-[8px] text-muted-foreground/30">Deploy in seconds</div>
                      </div>
                      <div className="rounded-lg bg-[hsl(220_20%_12%)] border border-[hsl(220_20%_16%)] p-3 text-center">
                        <Shield className="h-4 w-4 mx-auto mb-1.5 text-[hsl(200_80%_55%/0.5)]" />
                        <div className="text-[9px] font-semibold text-foreground/60 mb-0.5">Enterprise Security</div>
                        <div className="text-[8px] text-muted-foreground/30">SOC2 compliant</div>
                      </div>
                      <div className="rounded-lg bg-[hsl(220_20%_12%)] border border-[hsl(220_20%_16%)] p-3 text-center">
                        <Users className="h-4 w-4 mx-auto mb-1.5 text-[hsl(200_80%_55%/0.5)]" />
                        <div className="text-[9px] font-semibold text-foreground/60 mb-0.5">Team Collab</div>
                        <div className="text-[8px] text-muted-foreground/30">Real-time editing</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/95 border border-border/40 shadow-xl backdrop-blur-sm">
                  <Lock className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-[9px] text-muted-foreground/50">Changes won&apos;t apply until you approve</span>
                  <div className="h-5 px-3 rounded-full genie-gradient-bg flex items-center gap-1 cursor-default">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    <span className="text-[8px] font-medium text-primary-foreground">Approve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
