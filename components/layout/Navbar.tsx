import Link from "next/link";
import { Sparkles } from "lucide-react";

type Props = {
  isAuthed: boolean;
  activePath?: string;
};

function linkClass(active: boolean) {
  return `text-[14px] font-medium leading-5 transition-colors ${
    active
      ? "text-accent border-b-2 border-accent pb-1"
      : "text-text-dark hover:text-accent"
  }`;
}

export function Navbar({ isAuthed, activePath }: Props) {
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
            <Link href="/dashboard" className={linkClass(activePath === "/dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/find-jobs" className={linkClass(activePath === "/find-jobs")}>
              Find Jobs
            </Link>
          </li>
          <li>
            <Link href="/profile" className={linkClass(activePath === "/profile")}>
              Profile
            </Link>
          </li>
        </ul>

        <Link
          href={isAuthed ? "/dashboard" : "/login"}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-accent text-accent-foreground text-[14px] font-medium hover:bg-accent-dark transition-colors"
        >
          {isAuthed ? "Open dashboard" : "Start for free"}
        </Link>
      </nav>
    </header>
  );
}
