"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignUpForm } from "./components/SignUpForm";
import { OAuthButtons, AuthDivider } from "../components/OAuthButtons";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-[420px] shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-[18px]">Create account</CardTitle>
        <CardDescription>Warm onboarding in under 30 seconds.</CardDescription>
      </CardHeader>
      <SignUpForm />
      <AuthDivider />
      <OAuthButtons />
    </Card>
  );
}
