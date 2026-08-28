"use client";

import { useEffect } from "react";
import { capturePageview } from "@/lib/posthog-client";

export function PageviewTracker({ path }: { path: string }) {
  useEffect(() => {
    capturePageview(path);
  }, [path]);
  return null;
}
