import * as React from "react";

type BadgeVariant = "stone" | "amber" | "emerald" | "dark";
type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  withDot?: boolean;
  dotColor?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  stone: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
  amber:
    "border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  dark: "bg-stone-900 text-white dark:bg-white dark:text-stone-900",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-[10px] font-semibold tracking-widest",
  md: "px-3 py-1 text-xs font-semibold",
};

export function Badge({
  variant = "stone",
  size = "md",
  withDot = false,
  dotColor = "bg-amber-500",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {withDot && <span className={`h-2 w-2 rounded-full ${dotColor} ${dotColor.includes("amber") ? "animate-pulse" : ""}`} aria-hidden />}
      {children}
    </span>
  );
}

export function Dot({ color = "bg-amber-500", pulse = false }: { color?: string; pulse?: boolean }) {
  return <span className={`h-2 w-2 rounded-full ${color} ${pulse ? "animate-pulse" : ""}`} aria-hidden />;
}
