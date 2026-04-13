"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  PiggyBank,
  Landmark,
  CreditCard,
  Settings,
  Menu,
  Receipt,
  ArrowLeft,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignOutButton } from "@/components/auth/sign-out-button";

const prefix = "/savings";

const baseLinks = [
  { href: `${prefix}`, label: "Dashboard", icon: LayoutDashboard },
  { href: `${prefix}/entries`, label: "Monthly entries", icon: PiggyBank },
  { href: `${prefix}/deductions`, label: "Deductions", icon: Receipt },
  { href: `${prefix}/accounts`, label: "Accounts", icon: Landmark },
  { href: `${prefix}/credit`, label: "Lines of credit", icon: CreditCard },
  { href: `${prefix}/settings`, label: "Settings", icon: Settings },
] as const;

const adminLink = {
  href: `${prefix}/users`,
  label: "Users",
  icon: Users,
} as const;

function NavLinks({
  onNavigate,
  isAdmin,
}: {
  onNavigate?: () => void;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const links = isAdmin ? [...baseLinks, adminLink] : [...baseLinks];
  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === prefix
            ? pathname === prefix || pathname === `${prefix}/`
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SavingsSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  const switchLink = (
    <Link
      href="/"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "mb-2 w-full justify-start gap-2 px-3 text-muted-foreground hover:text-foreground",
      )}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      Switch app
    </Link>
  );

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar lg:flex lg:min-h-screen lg:flex-col">
        <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            Savings Tracker
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-3">
          {switchLink}
          <NavLinks isAdmin={isAdmin} />
          <div className="mt-auto border-t border-sidebar-border pt-3">
            <SignOutButton className="w-full justify-start px-3" />
          </div>
        </div>
      </aside>

      <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <span className="text-sm font-semibold">Savings Tracker</span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "shrink-0",
            )}
          >
            <Menu className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full justify-start gap-2",
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Switch app
              </Link>
              <NavLinks isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
              <div className="border-t border-border pt-3">
                <SignOutButton
                  className="w-full justify-start px-3"
                  onBeforeSignOut={() => setOpen(false)}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
