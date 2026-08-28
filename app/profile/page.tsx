import Link from "next/link";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  const cookieStore = await cookies();
  const isAuthed = Boolean(
    cookieStore.get("insforge_access_token")?.value,
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthed={isAuthed} />
      <main className="flex-1 mx-auto max-w-[1440px] w-full px-8 py-12">
        <div className="max-w-2xl">
          <h1 className="text-[32px] font-semibold leading-10 text-text-primary">
            Profile
          </h1>
          <p className="mt-2 text-[14px] leading-5 text-text-secondary">
            {user ? `Signed in as ${user.email}` : "Not signed in."}
          </p>
        </div>

        <div className="mt-8 bg-surface border border-border rounded-2xl p-8">
          <h2 className="text-[16px] font-semibold leading-6 text-text-primary">
            Coming soon
          </h2>
          <p className="mt-2 text-[14px] leading-5 text-text-secondary">
            The full profile editor — resume upload, work experience, skills,
            job preferences — is part of Feature 05 in the build plan.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md px-4 py-2 bg-accent text-accent-foreground text-[14px] font-medium hover:bg-accent-dark transition-colors"
            >
              Back to dashboard
            </Link>
            <Link
              href="/api/auth/logout"
              className="inline-flex items-center rounded-md px-4 py-2 border border-border text-text-primary text-[14px] font-medium hover:bg-surface-secondary transition-colors"
            >
              Sign out
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
