import { BrandingPanel, AuthMobileHeader } from "./components/BrandingPanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fafaf9] dark:bg-stone-950">
      <BrandingPanel />
      <div className="flex flex-1 flex-col">
        <AuthMobileHeader />
        <main className="flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.07),_transparent_55%)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
