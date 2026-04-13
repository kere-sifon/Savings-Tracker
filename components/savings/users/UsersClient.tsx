"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export function UsersClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentId = session?.user?.id;
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/savings/users");
    if (!res.ok) {
      setLoadError("Could not load users.");
      setLoading(false);
      return;
    }
    const data = (await res.json()) as UserRow[];
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    const res = await fetch("/api/savings/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: name.trim() || undefined,
        role,
      }),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setFormError(
        typeof data.error === "string" ? data.error : "Could not create user.",
      );
      return;
    }
    setEmail("");
    setPassword("");
    setName("");
    setRole("user");
    router.refresh();
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? They will no longer be able to sign in.")) {
      return;
    }
    const res = await fetch(`/api/savings/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(typeof data.error === "string" ? data.error : "Delete failed");
      return;
    }
    router.refresh();
    await load();
  }

  return (
    <div className="space-y-8">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add user</CardTitle>
          <CardDescription>
            New users receive the &quot;user&quot; role unless you choose admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Temporary password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Role</Label>
              <select
                id="new-role"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-name">Name (optional)</Label>
              <Input
                id="new-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {formError ? (
              <p className="text-sm text-destructive sm:col-span-2" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Adding…" : "Add user"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">All users</h2>
        {loadError ? (
          <p className="text-sm text-destructive">{loadError}</p>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users.</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border/80 bg-card">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{u.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {u.name ?? "—"} ·{" "}
                    <span className="capitalize">{u.role}</span>
                    {u.id === currentId ? (
                      <span className="ml-2 text-xs text-primary">(you)</span>
                    ) : null}
                  </p>
                </div>
                {u.id !== currentId ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Remove
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
