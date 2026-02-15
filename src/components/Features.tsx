import { Brain, Zap, GitPullRequest, Rocket, MapPin, RefreshCcw } from "lucide-react";

const valuePillars = [
  {
    icon: Brain,
    title: "AI-powered root-cause analysis",
    description: "Genie understands your stack traces, logs, sessions and environment to tell you exactly why an error is happening.",
  },
  {
    icon: Zap,
    title: "One-click fixes",
    description: "Generate patch code instantly with AI trained on your project structure and tech stack.",
  },
  {
    icon: GitPullRequest,
    title: "Automated PR creation",
    description: "Genie creates pull requests with explanations, tests and impact analysis.",
  },
  {
    icon: Rocket,
    title: "Safe deploy to staging or production",
    description: "Deploy AI-generated fixes directly from Genie. Admin approval required for production.",
  },
  {
    icon: MapPin,
    title: "Full user-session context",
    description: "See exactly where users got stuck — sessions, devices, OS, browser and timeline.",
  },
  {
    icon: RefreshCcw,
    title: "Regression detection",
    description: "Automatically detect bugs that reappear after deploys. Compare releases to prevent broken fixes.",
  },
];

const Features = () => {
    return (
        <section className="py-24 md:py-32 border-t border-border/50" id="features">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Everything you need to{" "}
                <span className="genie-gradient-text">ship with confidence</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From detection to deployment, Genie handles the entire bug resolution lifecycle
            </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {valuePillars.map((pillar) => (
                <div
                key={pillar.title}
                className="group relative p-8 rounded-2xl bg-card/50 ring-1 ring-white/10 hover:bg-card hover:ring-1 hover:ring-primary/30 transition-all duration-300"
                >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                
                <div className="relative">
                    <div className="h-14 w-14 rounded-xl genie-gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                    <pillar.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Features;