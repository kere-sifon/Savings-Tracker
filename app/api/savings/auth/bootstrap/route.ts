import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/savings/User";

const bootstrapSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1).optional(),
});

/** Public: whether the first admin can still be created (no users yet). */
export async function GET() {
  try {
    await connectDB();
    const count = await User.countDocuments();
    return NextResponse.json({ eligible: count === 0 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to check bootstrap status" },
      { status: 500 },
    );
  }
}

/** Public only when there are zero users — creates the first admin. */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const existing = await User.countDocuments();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Bootstrap is only available when no users exist" },
        { status: 403 },
      );
    }
    const json = await request.json();
    const parsed = bootstrapSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { email, password, name } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name ?? undefined,
      role: "admin",
    });
    return NextResponse.json({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to create user";
    if (msg.includes("duplicate") || msg.includes("E11000")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
