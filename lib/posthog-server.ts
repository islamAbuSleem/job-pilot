import { PostHog } from "posthog-node";

export function createPostHogServer() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || !host) return null;

  return new PostHog(key, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const client = createPostHogServer();
  if (!client) return;
  try {
    client.capture({ distinctId, event, properties });
    await client.shutdown();
  } catch (error) {
    console.error("[posthog-server] capture failed", event, (error as Error).message);
  }
}
