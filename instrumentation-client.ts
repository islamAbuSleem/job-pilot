import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const identifiedUserStorageKey = "posthog_identified_user_id";

async function identifyAuthenticatedUser() {
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error) return;

  const user = data.user;
  const previouslyIdentifiedUserId = window.localStorage.getItem(
    identifiedUserStorageKey,
  );

  if (!user) {
    if (previouslyIdentifiedUserId) {
      posthog.reset();
      window.localStorage.removeItem(identifiedUserStorageKey);
    }
    return;
  }

  if (
    previouslyIdentifiedUserId &&
    previouslyIdentifiedUserId !== user.id
  ) {
    posthog.reset();
  }

  posthog.identify(user.id, {
    email: user.email,
    name: user.profile?.name,
  });
  window.localStorage.setItem(identifiedUserStorageKey, user.id);
}

if (!projectToken || !host) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = projectToken
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
    console.error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });

  void identifyAuthenticatedUser();
}
