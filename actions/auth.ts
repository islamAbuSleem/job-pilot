"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

type OAuthProvider = "google" | "github";

export async function initiateOAuth(provider: OAuthProvider) {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const redirectTo = new URL(
    "/api/auth/callback",
    process.env.NEXT_PUBLIC_APP_URL,
  ).toString();

  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo,
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data?.codeVerifier) {
    return { success: false, error: error?.message ?? "OAuth init failed" };
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  redirect(data.url);
}

export async function signOut() {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });
  return auth.signOut();
}
