"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Sign in</CardTitle>
        <CardDescription>Enter your credentials or use OAuth.</CardDescription>
      </CardHeader>

      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="mt-2 w-full">
          Sign in
        </Button>
        <p className="text-center text-xs text-zinc-500">
          UI only — wiring in BE phase. <Link href="/signup" className="font-medium underline">Need an account?</Link>
        </p>
      </form>

      <div className="my-6 flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full" type="button">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.9-4.1 2.9-6.9z"
            />
          </svg>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.4c-5.2 0-9.4 4.2-9.4 9.4 0 4.2 2.7 7.7 6.5 8.9.5.1.7-.2.7-.5v-1.7c-2.7.6-3.2-1.1-3.2-1.1-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-2.1-.2-4.3-1.1-4.3-4.8 0-1.1.4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1 .8-.2 1.6-.3 2.4-.3.8 0 1.6.1 2.4.3 1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.5 1 2.6 0 3.7-2.2 4.6-4.3 4.8.3.3.6.8.6 1.6v2.4c0 .3.2.6.7.5 3.8-1.2 6.5-4.7 6.5-8.9 0-5.2-4.2-9.4-9.4-9.4z" />
          </svg>
          Continue with GitHub
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        <Link href="/" className="underline">Back to home</Link> · <Link href="/dashboard" className="underline">Dashboard (mock)</Link>
      </p>
    </Card>
  );
}
