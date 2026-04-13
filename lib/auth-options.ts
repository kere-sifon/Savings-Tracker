import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAuthSecret } from "@/lib/auth-secret";
import { connectSavingsDB } from "@/lib/db-savings";
import { User } from "@/lib/models/savings/User";

function coerceCredential(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = credentials as Record<string, unknown> | undefined;
        const email = coerceCredential(creds?.email).toLowerCase().trim();
        const password = coerceCredential(creds?.password);
        if (!email || !password) return null;
        await connectSavingsDB();
        const user = await User.findOne({ email }).select("+passwordHash");
        if (!user?.passwordHash) return null;
        let ok = false;
        try {
          ok = bcrypt.compareSync(password, user.passwordHash);
        } catch {
          ok = false;
        }
        if (!ok) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: getAuthSecret(),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.role = (user as { role?: "admin" | "user" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = token.email as string;
        session.user.name = (token.name as string | undefined) ?? null;
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
  },
};
