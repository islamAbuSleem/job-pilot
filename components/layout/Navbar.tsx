import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="w-full bg-surface border-b border-border">
      <nav className="mx-auto max-w-[1440px] h-16 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{
              background: "linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)",
            }}
          >
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </span>
          <span className="text-[19px] font-bold leading-7 text-text-darkest">
            JobPilot
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/dashboard"
              className="text-[14px] font-medium leading-5 text-text-dark hover:text-accent transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/find-jobs"
              className="text-[14px] font-medium leading-5 text-text-dark hover:text-accent transition-colors"
            >
              Find Jobs
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="text-[14px] font-medium leading-5 text-text-dark hover:text-accent transition-colors"
            >
              Profile
            </Link>
          </li>
        </ul>

        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-accent text-accent-foreground text-[14px] font-medium hover:bg-accent-dark transition-colors"
        >
          Start for free
        </Link>
      </nav>
    </header>
  );
}
