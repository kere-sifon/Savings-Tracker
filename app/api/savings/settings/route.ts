import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateSettings, Settings } from "@/lib/models/savings/Settings";

const settingsPutSchema = z.object({
  startingBalance: z.coerce.number(),
  partner1Name: z.string().min(1),
  partner2Name: z.string().min(1),
});

export async function GET() {
  try {
    await connectDB();
    const doc = await getOrCreateSettings();
    return NextResponse.json(doc.toObject());
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const json = await request.json();
    const parsed = settingsPutSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const base = await getOrCreateSettings();
    const updated = await Settings.findByIdAndUpdate(
      base._id,
      {
        startingBalance: parsed.data.startingBalance,
        partner1Name: parsed.data.partner1Name,
        partner2Name: parsed.data.partner2Name,
      },
      { new: true, runValidators: true },
    ).lean();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
