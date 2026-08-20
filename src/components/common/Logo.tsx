export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="text-[11px] font-bold tracking-widest">JP</span>
    </div>
  );
}

export function LogoWithText() {
  return (
    <div className="flex items-center gap-3">
      <Logo />
      <span className="text-[15px] font-semibold tracking-tight">JobPilot</span>
      <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 sm:inline">
        MVP
      </span>
    </div>
  );
}
