import { AlertTriangle, Search, Code, GitPullRequest, Play, Rocket } from "lucide-react";

const workflowSteps = [
  { step: 1, title: "Error detected", icon: AlertTriangle },
  { step: 2, title: "AI root cause", icon: Search },
  { step: 3, title: "Fix generated", icon: Code },
  { step: 4, title: "PR created", icon: GitPullRequest },
  { step: 5, title: "Deploy staging", icon: Play },
  { step: 6, title: "Deploy prod", icon: Rocket },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/50" id="howitworks">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How <span className="genie-gradient-text">Genie</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six automated steps from error detection to production deployment
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          {workflowSteps.map((step) => (
            <div key={step.step} className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-2xl genie-gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                  <step.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background ring-2 ring-primary flex items-center justify-center text-sm font-bold text-primary">
                  {step.step}
                </div>
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;