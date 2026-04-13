import { Schema, type Model } from "mongoose";
import { getSavingsConnection } from "@/lib/db-savings";

const settingsSchema = new Schema(
  {
    startingBalance: { type: Number, required: true, default: 10550 },
    partner1Name: { type: String, required: true, default: "Kere" },
    partner2Name: { type: String, required: true, default: "Ann" },
  },
  { timestamps: true },
);

type SettingsDoc = {
  startingBalance: number;
  partner1Name: string;
  partner2Name: string;
};

const conn = getSavingsConnection();
export const Settings: Model<SettingsDoc> =
  (conn.models.Settings as Model<SettingsDoc>) ||
  conn.model<SettingsDoc>("Settings", settingsSchema);

export async function getOrCreateSettings() {
  let doc = await Settings.findOne({}).sort({ createdAt: 1 });
  if (!doc) {
    doc = await Settings.create({
      startingBalance: 10550,
      partner1Name: "Kere",
      partner2Name: "Ann",
    });
  }
  return doc;
}
