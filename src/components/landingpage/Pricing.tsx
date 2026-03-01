'use client';

import { Check, X, Mail, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useScrollAnimation } from '@/hooks/useScrollAnimation';


const Pricing = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [annual, setAnnual] = useState(false);

  const btnBase = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 w-full cursor-pointer";
  const btnOutline = `${btnBase} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
  const btnGradient = `${btnBase} genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 genie-glow transition-all duration-300`;

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-32 border-t border-border/50" id="pricing">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, honest <span className="genie-gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${annual ? 'bg-primary' : 'bg-border'}`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${annual ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Annual
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">−21%</span>
          </span>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">

          {/* Free Plan */}
          <div className={`relative flex flex-col p-6 rounded-2xl border border-border/50 bg-card/50 scroll-reveal ${isVisible ? 'is-visible' : ''} stagger-1`}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <p className="text-sm text-muted-foreground mb-5">Try Genie on a single project.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm font-medium">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>100 credits/month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>1 connected project</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Genie Lite model only</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>7-day conversation history</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Deploy &amp; PR generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Monitoring</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Documentation support</span>
              </li>
            </ul>

            <Link className={btnOutline} href="/auth/signup">
              Start for free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className={`relative flex flex-col p-6 rounded-2xl border-2 border-primary ring-1 ring-primary bg-card shadow-xl shadow-primary/10 scroll-reveal ${isVisible ? 'is-visible' : ''} stagger-2`}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full genie-gradient-bg text-primary-foreground text-xs font-semibold whitespace-nowrap">
              Recommended
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground mb-5">For solo developers and freelancers.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{annual ? '€15' : '€19'}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              {annual ? (
                <p className="text-xs text-muted-foreground mt-1">Billed as €180/year</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">or €15/month billed annually</p>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm font-medium">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>1,000 credits/month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Lite + Pro + Max models</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Deploy + automatic PR generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Detailed diffs — individual or batch approval</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Monitoring <span className="text-muted-foreground">(errors, uptime, latest builds)</span></span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Unlimited conversation history</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Email support <span className="text-muted-foreground">— 48h response time</span></span>
              </li>
            </ul>

            <Link className={btnGradient} href="/auth/signup">
              Subscribe to Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className={`relative flex flex-col p-6 rounded-2xl border border-border/50 bg-card/50 scroll-reveal ${isVisible ? 'is-visible' : ''} stagger-3`}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Enterprise</h3>
              <p className="text-sm text-muted-foreground mb-5">For teams of 10+ devs that need SLA, SSO, or on-premise deployment.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">Let&apos;s talk</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Pricing negotiated case by case.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm font-medium">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Unlimited credits</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>SSO / SAML</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Guaranteed SLA</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>On-premise or private cloud</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Audit logs &amp; custom integrations</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Dedicated support</span>
              </li>
            </ul>

            <a className={btnOutline} href="mailto:hello@genie.dev">
              <Mail className="h-4 w-4" />
              Contact us
            </a>
          </div>

        </div>

        {/* Credits explanation */}
        <div className={`mt-6 rounded-2xl border border-border/50 bg-card/30 px-6 py-5 scroll-reveal ${isVisible ? 'is-visible' : ''} stagger-4`}>
          <div className="flex items-start gap-3">
            <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">What are credits?</p>
              <p className="text-sm text-muted-foreground">
                Credits are your monthly currency. <span className="text-foreground font-medium">Genie Lite costs 1 credit</span>, <span className="text-foreground font-medium">Genie Pro costs 5</span>, and <span className="text-foreground font-medium">Genie Max costs 20</span>. You choose the model on every message — fast and cheap, or deep and powerful.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Pricing;