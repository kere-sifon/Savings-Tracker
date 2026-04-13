import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";

const putSchema = z.object({
  amount: z.coerce.number(),
});

type RouteContext = { params: { id: string } };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const json = await request.json();
    const parsed = putSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const updated = await AccountDistribution.findByIdAndUpdate(
      id,
      { amount: parsed.data.amount, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 },
    );
  }
}
