import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`flex min-h-[120px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 disabled:opacity-50 transition-colors dark:border-stone-800 dark:bg-stone-900 dark:placeholder:text-stone-500 ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";
