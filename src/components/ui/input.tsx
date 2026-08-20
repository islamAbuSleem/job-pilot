import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", type = "text", ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={`flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-white ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
