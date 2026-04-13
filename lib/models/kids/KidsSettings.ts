import { Schema, type Model } from "mongoose";
import { getKidsConnection } from "@/lib/db-kids";

const kidsSettingsSchema = new Schema(
  {
    accountName: { type: String, required: true, default: "Kids Account" },
    ownerName: { type: String, default: "" },
    partnerName: { type: String, default: "" },
    currency: { type: String, required: true, default: "CAD" },
  },
  { timestamps: true },
);

type KidsSettingsDoc = {
  accountName: string;
  ownerName: string;
  partnerName: string;
  currency: string;
};

const conn = getKidsConnection();
export const KidsSettings: Model<KidsSettingsDoc> =
  (conn.models.KidsSettings as Model<KidsSettingsDoc>) ||
  conn.model<KidsSettingsDoc>("KidsSettings", kidsSettingsSchema);

export async function getOrCreateKidsSettings() {
  let doc = await KidsSettings.findOne({}).sort({ createdAt: 1 });
  if (!doc) {
    doc = await KidsSettings.create({
      accountName: "Kids Account",
      ownerName: "",
      partnerName: "",
      currency: "CAD",
    });
  }
  return doc;
}
