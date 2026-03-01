'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const integrations = [
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Vercel",
  "Netlify",
  "AWS",
  "GCP",
  "Cloudflare",
  "Fly.io",
  "Railway",
];

const supports = [
  "Next.js",
  "React",
  "Vue",
  "Laravel",
  "Node",
  "Python",
  "Go",
  "Flutter",
  "Swift",
  "Kotlin",
  "SQL",
  "and more...",
];

const WorksWithStack = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-32 border-t border-border/50" id="workswithstack">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Works with your <span className="genie-gradient-text">existing stack</span> 
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Genie understands any framework, language, or infrastructure
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4 uppercase">connects with</p>

          <div className="flex flex-wrap justify-center gap-3">
        {integrations.map((item, index) => (
            <div
              key={item}
             className={`px-6 py-3 rounded-xl bg-card/50 ring-1 ring-white/10 hover:bg-card hover:ring-1 hover:ring-primary/30 transition-all duration-300 scroll-reveal ${isVisible ? 'is-visible' : ''} stagger-${(index % 8) + 1}`}
            >
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4 uppercase">supports any stack</p>

        <div className="flex flex-wrap justify-center gap-3">
            {supports.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 text-sm rounded-lg bg-secondary/50 text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default WorksWithStack;