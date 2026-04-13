import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-helpers";
import { countAdmins, User } from "@/lib/models/savings/User";

const patchSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    password: z.string().min(8).optional(),
    role: z.enum(["admin", "user"]).optional(),
  })
  .refine((o) => o.name !== undefined || o.password !== undefined || o.role !== undefined, {
    message: "At least one field required",
  });

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;
  try {
    await connectDB();
    const json = await request.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const target = await User.findById(params.id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (parsed.data.role === "user" && target.role === "admin") {
      const admins = await countAdmins();
      if (admins <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin" },
          { status: 400 },
        );
      }
    }

    if (parsed.data.password) {
      target.passwordHash = await bcrypt.hash(parsed.data.password, 12);
    }
    if (parsed.data.name !== undefined) {
      target.name = parsed.data.name;
    }
    if (parsed.data.role !== undefined) {
      target.role = parsed.data.role;
    }
    await target.save();

    return NextResponse.json({
      id: String(target._id),
      email: target.email,
      name: target.name ?? null,
      role: target.role,
      updatedAt: target.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;
  const adminId = gate.session.user.id;
  try {
    await connectDB();
    if (params.id === adminId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 },
      );
    }
    const target = await User.findById(params.id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.role === "admin") {
      const admins = await countAdmins();
      if (admins <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin" },
          { status: 400 },
        );
      }
    }
    await User.deleteOne({ _id: params.id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
