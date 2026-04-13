import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { connectSavingsDB } from "@/lib/db-savings";
import { authOptions } from "@/lib/auth-options";
import { User } from "@/lib/models/savings/User";
import { SetupForm } from "@/components/auth/setup-form";

export default async function SetupPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  await connectSavingsDB();
  const count = await User.countDocuments();
  if (count > 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
        <div className="max-w-sm text-center text-sm text-muted-foreground">
          <p className="mb-4">An account already exists. Sign in instead.</p>
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <SetupForm />
    </div>
  );
}
