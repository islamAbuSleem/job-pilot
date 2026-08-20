"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-[420px] shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-[18px]">Create account</CardTitle>
        <CardDescription>Warm onboarding in under 30 seconds.</CardDescription>
      </CardHeader>

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

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-stone-500 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-400">
          OR
        </span>
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="flex flex-col gap-2.5">
        <Button variant="outline" className="w-full" type="button">
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          Continue with GitHub
        </Button>
      </div>
    </Card>
  );
}
