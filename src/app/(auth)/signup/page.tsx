"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Create account</CardTitle>
        <CardDescription>Start with email and password.</CardDescription>
      </CardHeader>

      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </label>
          <Input id="name" type="text" placeholder="Your name" />
        </div>
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
          Create account
        </Button>
        <p className="text-center text-xs text-zinc-500">
          UI only — hashing &amp; DB in BE phase. <Link href="/signin" className="font-medium underline">Already have an account?</Link>
        </p>
      </form>

      <div className="my-6 flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="flex flex-col gap-2">
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
