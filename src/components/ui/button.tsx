import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className = "",
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default:
      "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm hover:shadow dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-white",
    primary:
      "bg-amber-500 text-stone-900 hover:bg-amber-400 shadow-sm hover:shadow-md font-semibold",
    outline:
      "border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800",
    ghost: "hover:bg-stone-100 dark:hover:bg-stone-800",
    accent:
      "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 shadow-sm dark:bg-stone-900 dark:text-stone-50 dark:border-stone-800",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
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
