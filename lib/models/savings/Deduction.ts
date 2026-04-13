import { Schema, type Model } from "mongoose";
import { getSavingsConnection } from "@/lib/db-savings";

const deductionSchema = new Schema(
  {
    year: { type: Number, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

deductionSchema.index({ year: 1, month: 1 });

type DeductionDoc = {
  year: number;
  month: string;
  amount: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const conn = getSavingsConnection();
export const Deduction: Model<DeductionDoc> =
  (conn.models.Deduction as Model<DeductionDoc>) ||
  conn.model<DeductionDoc>("Deduction", deductionSchema);
