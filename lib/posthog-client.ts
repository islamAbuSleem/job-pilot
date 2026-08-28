import posthog from "posthog-js";

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}

export function capturePageview(path?: string) {
  posthog.capture("$pageview", path ? { $current_url: path } : undefined);
}
