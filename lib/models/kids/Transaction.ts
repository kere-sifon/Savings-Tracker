import { InferSchemaType, Schema, Types, type Model } from "mongoose";
import { getKidsConnection } from "@/lib/db-kids";

const transactionSchema = new Schema(
  {
    date: { type: Date, default: null },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["INCOME", "EXPENSE"] },
    amount: { type: Number, required: true },
    isCarryForward: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

transactionSchema.index({ date: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });

export type TransactionDoc = InferSchemaType<typeof transactionSchema> & {
  _id: Types.ObjectId;
};

const conn = getKidsConnection();
export const Transaction: Model<TransactionDoc> =
  (conn.models.Transaction as Model<TransactionDoc>) ||
  conn.model<TransactionDoc>("Transaction", transactionSchema);
