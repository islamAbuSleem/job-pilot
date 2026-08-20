"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// TODO(BE): replace preventDefault no-op and UI-only copy with real auth
export function SignInForm() {
  return (
    <form className="flex flex-col gap-3.5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300">
          Email
        </label>
        <Input id="email" type="email" placeholder="you@example.com" required />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300">
            Password
          </label>
          <Link href="#" className="text-xs text-stone-500 hover:underline">
            Forgot?
          </Link>
        </div>
        <Input id="password" type="password" placeholder="••••••••" required />
      </div>
      <Button type="submit" variant="default" className="mt-1 w-full">
        Sign in
      </Button>
      <p className="text-center text-xs text-stone-500">
        UI only — BE in next phase. <Link href="/signup" className="font-medium text-stone-900 underline dark:text-white">Create account</Link>
      </p>
    </form>
  );
}
