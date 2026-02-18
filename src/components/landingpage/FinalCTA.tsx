import { ArrowRight, Globe } from "lucide-react";
import Image from "next/image";


const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 border-t border-border/50" id="finalcta">
      {/* Background Light Effects - Full Width */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-250 h-200 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-150 h-150 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-primary/10 rounded-full blur-[80px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Image
              src="/genie-logo.png"
              alt="Genie"
              width={80}
              height={80}
            />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your project deserves better. <span className="genie-gradient-text">
                <br />Let Genie prove it.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No developers to hire. No agencies to manage. Just Genie.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/register">
            <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 genie-glow transition-all duration-300 h-12 rounded-lg gap-2 text-lg px-8 py-6 cursor-pointer">
              Start Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </a>

          <a href="/app">
            <button className="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 rounded-lg gap-2 text-lg px-8 py-6 cursor-pointer">
              <Globe className="h-5 w-5" />
              Request Enterprise Demo
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;