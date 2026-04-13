import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: "admin" | "user";
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    email?: string;
    role?: "admin" | "user";
    name?: string | null;
  }
}
