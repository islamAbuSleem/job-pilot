"use client";

import { Button } from "@/components/ui/button";

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-2.5">
      <Button variant="outline" className="w-full justify-center gap-2" type="button">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm text-[11px] font-bold">G</span>
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full justify-center gap-2" type="button">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-white text-xs">⌥</span>
        Continue with GitHub
      </Button>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-stone-500 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-400">
        OR
      </span>
      <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
    </div>
  );
}
