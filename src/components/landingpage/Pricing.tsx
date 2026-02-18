import { Check } from "lucide-react";


const Pricing = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/50" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, transparent <span className="genie-gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, scale as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-sm text-muted-foreground mb-4">Try Genie on a single project.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-muted-foreground">forever</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>1 project</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>50 credits/month (1 credit = 1 AI change)</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Instant code &amp; UI improvements</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Basic bug detection &amp; monitoring</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Community support</span>
              </li>
            </ul>
            <a className="block" href="/register">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer">
                Start Free
              </button>
            </a>
          </div>

          {/* Pro Plan */}
          <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">Evolve your projects without hiring anyone.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">€39</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>5 projects</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>500 credits/month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Full-stack AI changes, instantly</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Bug fixing &amp; auto-repair</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Continuous monitoring &amp; logs</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Safe preview before applying changes</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Email support</span>
              </li>
            </ul>
            <a className="block" href="/register">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer">
                Start Pro Trial
              </button>
            </a>
          </div>

          {/* Founder Plan */}
          <div className="relative p-6 rounded-2xl border-2 border-primary ring ring-primary bg-card shadow-xl shadow-primary/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Founder</h3>
              <p className="text-sm text-muted-foreground mb-4">Your AI dev team — on autopilot.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">€99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Unlimited projects &amp; credits</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>End-to-end evolution across frontend, backend, APIs, database &amp; infra</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Proactive improvements &amp; suggested fixes</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>24/7 monitoring &amp; alerts</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Production deploys with approval workflow</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
            <a className="block" href="/register">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 genie-glow transition-all duration-300 h-10 px-4 py-2 w-full cursor-pointer">
                Start Founder Trial
              </button>
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-sm text-muted-foreground mb-4">Private cloud, SSO, dedicated support.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Everything in Founder</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Private cloud &amp; SSO/SAML</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Audit logs &amp; custom integrations</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Dedicated support</span>
              </li>
            </ul>
            <a className="block" href="/register">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer">
                Contact Sales
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;