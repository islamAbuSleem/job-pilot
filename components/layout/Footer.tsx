import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border">
      <div className="mx-auto max-w-[1440px] px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{
              background: "linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)",
            }}
          >
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </span>
          <span className="text-[16px] font-bold text-text-darkest">
            JobPilot
          </span>
        </Link>

        <ul className="flex items-center gap-6">
          <li>
            <Link
              href="/dashboard"
              className="text-[14px] font-medium text-text-dark hover:text-accent transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-[14px] font-medium text-text-dark hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-[14px] font-medium text-text-dark hover:text-accent transition-colors"
            >
              Terms &amp; Condition
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
