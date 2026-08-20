"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignInForm } from "./components/SignInForm";
import { OAuthButtons, AuthDivider } from "../components/OAuthButtons";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-[420px] shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-[18px]">Welcome back</CardTitle>
        <CardDescription>Sign in — warm, fast, and secure.</CardDescription>
      </CardHeader>
      <SignInForm />
      <AuthDivider />
      <OAuthButtons />
      <p className="mt-6 text-center text-xs text-stone-400">
        <Link href="/" className="underline">Back to home</Link> · <Link href="/dashboard" className="underline">Dashboard (mock)</Link>
      </p>
    </Card>
  );
}
