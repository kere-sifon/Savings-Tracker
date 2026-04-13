/**
 * Must match how NextAuth resolves the signing secret (see next-auth/next).
 * Use the same value in middleware getToken() or JWT validation fails after login.
 */
export function getAuthSecret(): string | undefined {
  const s = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  return s && s.length > 0 ? s : undefined;
}
