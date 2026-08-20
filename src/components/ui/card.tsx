import * as React from "react";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-sm font-semibold ${className}`} {...props} />;
}

export function CardDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm leading-6 text-zinc-600 dark:text-zinc-400 ${className}`}
      {...props}
    />
  );
}
