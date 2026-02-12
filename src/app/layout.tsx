import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Genie - AI-Powered Software Maintenance",
  description: "Fix production issues automatically. Genie detects errors, explains root causes, generates code fixes, creates pull requests, and deploys updates to staging or production.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* Header fixo com container */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="max-w-screen-xl mx-auto px-6">
            <Header />
          </div>
        </div>
        
        {/* Espaço para compensar header fixo */}
        <div className="h-20" />
        
        {/* Hero full width com Dashboard Preview */}
        <Hero />

        <Features />
        <HowItWorks />
        
        {/* Conteúdo com container */}
        <div className="max-w-screen-xl mx-auto px-6">
          {children}
        </div>
      </body>
    </html>
  );
}
