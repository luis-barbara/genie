import { Sparkles, ArrowRight, Play } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 pb-24">
      {/* Background Light Effects - Full Width */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 ring-1 ring-primary/30 text-sm text-primary mb-8">
        <Sparkles className="h-4 w-4" />
        AI-Powered Software Maintenance
      </div>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
        Fix production issues — <span className="genie-gradient-text">automatically.</span>
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
        Ship faster with AI-powered software maintenance.
      </p>

      <p className="text-lg text-muted-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed">
        Genie is an AI platform that detects errors, explains root causes, generates code fixes, creates pull requests, and deploys updates to staging or production — all without leaving your workflow.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <a href="/register">
          <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 genie-glow transition-all duration-300 h-12 rounded-lg gap-2 text-lg px-8 py-6 cursor-pointer">
            Start Free
            <ArrowRight className="h-5 w-5" />
          </button>
        </a>

        <a href="/app">
          <button className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 rounded-lg gap-2 text-lg px-8 py-6 cursor-pointer">
            <Play className="h-5 w-5" />
            View Live Demo
          </button>
        </a>
      </div>

      <p className="text-sm text-muted-foreground/60">
        No setup. Works with any framework. GitHub-native.
      </p>
      </div>

      {/* Dashboard Preview */}
      <div className="relative z-10">
        <DashboardPreview />
      </div>
    </section>
  );
};

export default Hero;

