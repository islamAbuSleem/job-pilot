"use client";

import { useState, useTransition } from "react";
import { initiateOAuth } from "@/actions/auth";

type Provider = "google" | "github";

type Props = {
  nextPath?: string;
};

const PROVIDERS: {
  id: Provider;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (p) => (
      <svg
        className={p.className}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.972 32.91 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.397 0-9.937-3.073-11.282-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    ),
  },
  {
    id: "github",
    label: "Continue with GitHub",
    icon: (p) => (
      <svg
        className={p.className}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        fill="currentColor"
      >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.07.78 2.17v3.22c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
];

export function OAuthButtons({ nextPath: _nextPath }: Props) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [, startTransition] = useTransition();

  function handleClick(provider: Provider) {
    setPending(provider);
    startTransition(() => {
      void initiateOAuth(provider);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map((p) => {
        const Icon = p.icon;
        const isLoading = pending === p.id;
        const isDisabled = pending !== null;

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p.id)}
            disabled={isDisabled}
            className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span>{isLoading ? "Redirecting..." : p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
