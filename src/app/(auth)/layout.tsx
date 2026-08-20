import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="flex h-14 items-center justify-center border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          JobPilot
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">{children}</main>
    </div>
  );
}
