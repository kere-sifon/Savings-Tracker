import { SavingsSidebar } from "@/components/layout/SavingsSidebar";

export function AppShell({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <SavingsSidebar isAdmin={isAdmin} />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
