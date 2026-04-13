import { InferSchemaType, Schema, Types, type Model } from "mongoose";
import { getSavingsConnection } from "@/lib/db-savings";

const monthlyEntrySchema = new Schema(
  {
    year: { type: Number, required: true },
    month: { type: String, required: true },
    kere: { type: Number, required: true, default: 0, min: 0 },
    ann: { type: Number, required: true, default: 0, min: 0 },
    note: { type: String, default: null },
  },
  { timestamps: true },
);

monthlyEntrySchema.index({ year: 1, month: 1 }, { unique: true });

export type MonthlyEntryDoc = InferSchemaType<typeof monthlyEntrySchema> & {
  _id: Types.ObjectId;
};

const conn = getSavingsConnection();
export const MonthlyEntry: Model<MonthlyEntryDoc> =
  (conn.models.MonthlyEntry as Model<MonthlyEntryDoc>) ||
  conn.model<MonthlyEntryDoc>("MonthlyEntry", monthlyEntrySchema);
