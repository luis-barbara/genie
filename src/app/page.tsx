import Header from "@/components/landingpage/Header";
import Hero from "@/components/landingpage/Hero";
import Features from "@/components/landingpage/Features";
import HowItWorks from "@/components/landingpage/HowItWorks";
import WorksWithStack from "@/components/landingpage/WorksWithStack";
import GenieCopilot from "@/components/landingpage/GenieCopilot";
import Pricing from "@/components/landingpage/Pricing";
import GenieInNumbers from "@/components/landingpage/GenieInNumbers";
import FinalCTA from "@/components/landingpage/FinalCTA";
import Footer from "@/components/landingpage/Footer";

export default function Home() {
  return (
    <>
      {/* Header fixo com container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <Header />
        </div>
      </div>

      {/* Espaço para compensar header fixo */}
      <div className="h-20" />

      {/* Hero full width com Dashboard Preview */}
      <Hero />

      <GenieInNumbers />
      <Features />
      <HowItWorks />
      <WorksWithStack />
      <GenieCopilot />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  );
}

