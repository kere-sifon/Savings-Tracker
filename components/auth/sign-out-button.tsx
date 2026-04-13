"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "ghost" | "outline";
  /** e.g. close mobile menu before navigating away */
  onBeforeSignOut?: () => void;
};

export function SignOutButton({
  className,
  variant = "ghost",
  onBeforeSignOut,
}: Props) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className={cn("gap-2", className)}
      onClick={() => {
        onBeforeSignOut?.();
        signOut({ callbackUrl: "/login" });
      }}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      Sign out
    </Button>
  );
}
