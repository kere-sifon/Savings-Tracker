import { KidsSidebar } from "@/components/layout/KidsSidebar";

export function KidsAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <KidsSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
