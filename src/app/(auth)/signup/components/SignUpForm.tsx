"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  return (
    <form className="flex flex-col gap-3.5" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300">
          Name
        </label>
        <Input id="name" type="text" placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300">
          Email
        </label>
        <Input id="email" type="email" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300">
          Password
        </label>
        <Input id="password" type="password" placeholder="••••••••" required />
        <p className="mt-1.5 text-xs text-stone-500">Min 8 chars — hashing in BE phase.</p>
      </div>
      <Button type="submit" variant="primary" className="mt-1 w-full">
        Create account
      </Button>
      <p className="text-center text-xs text-stone-500">
        Already have an account? <Link href="/signin" className="font-medium text-stone-900 underline dark:text-white">Sign in</Link>
      </p>
    </form>
  );
}
