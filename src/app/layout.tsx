import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genie - An entire dev team in one AI.",
  description: "Connect your project and let Genie handle the rest. AI that understands your entire project — frontend, backend, APIs, database, infrastructure. Fixes bugs, improves features, deploys changes. All in seconds, fully under your control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
