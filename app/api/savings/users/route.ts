import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-helpers";
import { User } from "@/lib/models/savings/User";

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1).optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export async function GET() {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;
  try {
    await connectDB();
    const users = await User.find({})
      .select("email name role createdAt updatedAt")
      .sort({ email: 1 })
      .lean();
    return NextResponse.json(
      users.map((u) => ({
        id: String(u._id),
        email: u.email,
        name: u.name ?? null,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;
  try {
    await connectDB();
    const json = await request.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { email, password, name, role } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name ?? undefined,
      role: role ?? "user",
    });
    return NextResponse.json({
      id: String(user._id),
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("duplicate") || msg.includes("E11000")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
