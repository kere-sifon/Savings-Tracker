import { getServerSession } from "next-auth/next";
import { AppShell } from "@/components/layout/AppShell";
import { authOptions } from "@/lib/auth-options";

export default async function SavingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  return <AppShell isAdmin={isAdmin}>{children}</AppShell>;
}
