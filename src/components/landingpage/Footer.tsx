

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <section className="py-24 md:py-32 border-t border-border/50" id="footer">
      <div className="max-w-7xl mx-auto px-6">

        {/* GRID */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link className="flex items-center gap-2 mb-4" href="/">
              <Image
                src="/genie-logo-2.png"
                alt="Genie"
                width={32}
                height={32}
              />
              <span className="text-2xl font-bold text-white">Genie</span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs">
              Your AI engineering team for existing projects. 
              Connect, evolve, and deploy — instantly.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Legal</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Genie. AI-Powered Software Evolution.
          </p>

          <div className="flex items-center gap-6">
            <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/auth/login">
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background 
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                         focus-visible:ring-offset-2
                         [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 
                         genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 
                         genie-glow transition-all duration-300 h-10 rounded-md px-4"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Footer;