import { KidsAppShell } from "@/components/layout/KidsAppShell";

export default function KidsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <KidsAppShell>{children}</KidsAppShell>;
}
