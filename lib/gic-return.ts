import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";

/** Must match the Accounts seed / UI label for GIC return balance. */
export const GIC_RETURN_ACCOUNT_LABEL = "GIC Return";

export async function getGicReturnAmount(): Promise<number> {
  const doc = await AccountDistribution.findOne({
    label: GIC_RETURN_ACCOUNT_LABEL,
  }).lean();
  return doc?.amount ?? 0;
}
