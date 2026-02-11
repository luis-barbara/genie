import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (
        <header className="flex justify-between items-center py-4 px-6 ">
            <Link href="/" className="flex items-center gap-2 ">
                <Image
                    src="/genie-logo.png"
                    alt="Genie"
                    width={80}
                    height={80}
                    className="h-20 w-20 -my-4"
                />
                <span className="text-2xl font-bold genie-gradient-text">Genie</span>
            </Link>

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

            <div className="flex items-center gap-4">
                <Link href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                >
                    Login
                </Link>

                <Link href="/register">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 genie-glow transition-all duration-300 h-9 rounded-md px-3 gap-2 cursor-pointer">
                        Start Free
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-arrow-right h-4 w-4" 
                        >
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </button>
                </Link>
            </div>
        </header>
    );
}

export default Header;