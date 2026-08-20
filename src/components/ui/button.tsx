import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className = "",
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default:
      "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900",
    outline:
      "border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-sm",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
