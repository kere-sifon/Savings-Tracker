import { NextResponse } from "next/server";
import { z } from "zod";
import { connectKidsDB } from "@/lib/db-kids";
import { getOrCreateKidsSettings } from "@/lib/models/kids/KidsSettings";

export const dynamic = "force-dynamic";

const putSchema = z.object({
  accountName: z.string().min(1),
  ownerName: z.string(),
  partnerName: z.string(),
  currency: z.string().min(1),
});

export async function GET() {
  try {
    await connectKidsDB();
    const s = await getOrCreateKidsSettings();
    return NextResponse.json(s.toObject());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectKidsDB();
    const json = await req.json();
    const parsed = putSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const s = await getOrCreateKidsSettings();
    Object.assign(s, parsed.data);
    await s.save();
    return NextResponse.json(s.toObject());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
