import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { safeCallbackUrl } from "@/lib/auth-callback-url";
import { connectSavingsDB } from "@/lib/db-savings";
import { User } from "@/lib/models/savings/User";
import { LoginForm } from "@/components/auth/login-form";

type Props = {
  searchParams: { callbackUrl?: string };
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const callbackUrl = safeCallbackUrl(searchParams.callbackUrl, "/");
  if (session) {
    redirect(callbackUrl);
  }

  await connectSavingsDB();
  const bootstrapEligible = (await User.countDocuments()) === 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <LoginForm callbackUrl={callbackUrl} bootstrapEligible={bootstrapEligible} />
    </div>
  );
}
