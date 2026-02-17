import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/genie-logo.png"
          alt="Genie"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <span className="text-2xl font-bold genie-gradient-text">Genie</span>
      </Link>

      {/* Navegação */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Features
        </a>
        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          How It Works
        </a>
        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </a>
      </nav>

      {/* Botões */}
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Login
        </Link>

        <Link href="/register">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 genie-gradient-bg text-primary-foreground font-black hover:opacity-90 genie-glow transition-all duration-300 h-9 rounded-md px-3 gap-2 cursor-pointer">
            Start Free
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
