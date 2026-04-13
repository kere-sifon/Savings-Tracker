import { Schema, type Model } from "mongoose";
import { getSavingsConnection } from "@/lib/db-savings";

const lineOfCreditSchema = new Schema(
  {
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

lineOfCreditSchema.index({ name: 1 }, { unique: true });

type LineOfCreditDoc = {
  name: string;
  balance: number;
  updatedAt: Date;
};

const conn = getSavingsConnection();
export const LineOfCredit: Model<LineOfCreditDoc> =
  (conn.models.LineOfCredit as Model<LineOfCreditDoc>) ||
  conn.model<LineOfCreditDoc>("LineOfCredit", lineOfCreditSchema);
