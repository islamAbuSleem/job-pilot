"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-[420px] shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-[18px]">Welcome back</CardTitle>
        <CardDescription>Sign in — warm, fast, and secure.</CardDescription>
      </CardHeader>

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

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-stone-500 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-400">
          OR
        </span>
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="flex flex-col gap-2.5">
        <Button variant="outline" className="w-full justify-center gap-2" type="button">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">G</span>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full justify-center gap-2" type="button">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-white">⌥</span>
          Continue with GitHub
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-stone-400">
        <Link href="/" className="underline">Back to home</Link> · <Link href="/dashboard" className="underline">Dashboard (mock)</Link>
      </p>
    </Card>
  );
}
