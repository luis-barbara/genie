import { Brain, Zap, GitPullRequest, Rocket, MapPin, RefreshCcw } from "lucide-react";

const valuePillars = [
  {
    icon: Brain,
    title: "Reads your entire project",
    description: "Understands your code, architecture, dependencies, and patterns. Knows your project inside-out.",
  },
  {
    icon: Zap,
    title: "Make changes in plain language",
    description: "Just tell Genie what to do. It generates the updates, explains them, and waits for your approval.",
  },
  {
    icon: GitPullRequest,
    title: "Preview before applying",
    description: "Full preview, risk assessment, and safety checks. Nothing touches your code without your OK.",
  },
  {
    icon: Rocket,
    title: "Deploy from one place",
    description: "Approved changes become PRs, run tests, and deploy automatically to staging or production.",
  },
  {
    icon: MapPin,
    title: "Catch and fix issues instantly",
    description: "Detects bugs, performance problems, and vulnerabilities before your users notice. Suggests safe fixes immediately.",
  },
  {
    icon: RefreshCcw,
    title: "Learns and improves over time",
    description: "Remembers past decisions, adapts to your patterns, and continuously evolves alongside your project.",
  },
];

const Features = () => {
    return (
        <section className="py-24 md:py-32 border-t border-border/50" id="features">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                One Ai. Every role.{" "}
                <span className="genie-gradient-text">From request to production.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Genie evolves your existing project — frontend, backend, APIs, database, infrastructure — instantly, without developers.
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