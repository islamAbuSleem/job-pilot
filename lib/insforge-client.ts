import { createBrowserClient } from "@insforge/sdk/ssr";
import posthog from "posthog-js";

export const insforge = createBrowserClient();

let identifiedUserId: string | null = null;

export async function identifyCurrentUser() {
  const { data } = await insforge.auth.getCurrentUser();
  const user = data.user;

  if (!user || identifiedUserId === user.id) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.profile?.name,
  });
  identifiedUserId = user.id;
}
