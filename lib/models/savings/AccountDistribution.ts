import { Schema, type Model } from "mongoose";
import { getSavingsConnection } from "@/lib/db-savings";

const accountDistributionSchema = new Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

accountDistributionSchema.index({ label: 1 }, { unique: true });

type AccountDistributionDoc = {
  label: string;
  amount: number;
  updatedAt: Date;
};

const conn = getSavingsConnection();
export const AccountDistribution: Model<AccountDistributionDoc> =
  (conn.models.AccountDistribution as Model<AccountDistributionDoc>) ||
  conn.model<AccountDistributionDoc>("AccountDistribution", accountDistributionSchema);
