import * as React from "react";

export function Label({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block text-xs font-semibold tracking-wide text-stone-700 dark:text-stone-300 ${className}`}>
      {children}
    </label>
  );
}
