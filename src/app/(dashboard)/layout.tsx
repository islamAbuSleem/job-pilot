import { Sidebar, MobileTopbar } from "./components/Sidebar";

// TODO(BE): replace hardcoded fake session with real Auth.js session

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = { user: { email: "dev@example.com", name: "Dev" } } as const;

  return (
    <div className="flex min-h-screen bg-[#fafaf9] dark:bg-stone-950">
      <Sidebar email={session.user.email} />
      <div className="flex flex-1 flex-col">
        <MobileTopbar email={session.user.email} />
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
