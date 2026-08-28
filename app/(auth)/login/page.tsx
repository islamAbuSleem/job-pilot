import Link from "next/link";
import { Sparkles } from "lucide-react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "OAuth sign-in failed. Please try again.",
  missing_verifier: "Your sign-in session expired. Please try again.",
  exchange_failed: "Could not complete sign-in. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;
  const message = error ? ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again." : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full bg-surface border-b border-border">
        <div className="mx-auto max-w-[1440px] h-16 px-6 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{
                background: "linear-gradient(45deg, #7C5CFC 0%, #4A2EC5 100%)",
              }}
            >
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </span>
            <span className="text-[19px] font-bold leading-7 text-text-darkest">
              JobPilot
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="text-center">
              <h1 className="text-[24px] font-semibold leading-8 text-text-primary">
                Sign in to JobPilot
              </h1>
              <p className="mt-2 text-[14px] leading-5 text-text-secondary">
                Continue with your preferred account to find your next role.
              </p>
            </div>

            {message ? (
              <div
                role="alert"
                className="mt-6 rounded-md border border-border bg-surface-secondary px-3 py-2 text-[13px] text-error"
              >
                {message}
              </div>
            ) : null}

            <div className="mt-8">
              <OAuthButtons nextPath={next} />
            </div>

            <p className="mt-8 text-center text-[12px] leading-4 text-text-muted">
              By continuing, you agree to JobPilot&rsquo;s{" "}
              <Link href="#" className="text-accent hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
