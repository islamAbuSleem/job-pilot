import Link from "next/link";
import { Logo, LogoWithText } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-white/80 backdrop-blur-md dark:border-stone-800/50 dark:bg-stone-900/70">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-6">
        <LogoWithText />
        <nav className="flex items-center gap-2">
          <Link
            href="/signin"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-800 hover:shadow dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
          >
            Go to Dashboard →
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function CompactHeader() {
  return (
    <header className="flex h-14 items-center justify-center border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 lg:hidden">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
        <Logo size={28} />
        JobPilot
      </Link>
    </header>
  );
}
