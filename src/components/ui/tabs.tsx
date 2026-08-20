"use client";

import * as React from "react";

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="border-b border-stone-200 dark:border-stone-800">
      <nav className="flex gap-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? "border-b-2 border-amber-500 text-stone-900 dark:text-white"
                : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
