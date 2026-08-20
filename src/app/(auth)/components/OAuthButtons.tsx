"use client";

import { Button } from "@/components/ui/button";

// TODO(BE): wire to real OAuth providers
export type OAuthProvider = { id: string; label: string; icon: string; iconBg: string };

const DEFAULT_PROVIDERS: OAuthProvider[] = [
  { id: "google", label: "Continue with Google", icon: "G", iconBg: "bg-white shadow-sm text-[11px] font-bold" },
  { id: "github", label: "Continue with GitHub", icon: "⌥", iconBg: "bg-stone-900 text-white text-xs" },
];

export function OAuthButtons({ providers = DEFAULT_PROVIDERS }: { providers?: OAuthProvider[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {providers.map((p) => (
        <Button key={p.id} variant="outline" className="w-full justify-center gap-2" type="button">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${p.iconBg}`}>{p.icon}</span>
          {p.label}
        </Button>
      ))}
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
