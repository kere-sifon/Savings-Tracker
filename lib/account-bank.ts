import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";

/** Account distribution row whose balance tracks cash in/out from the ledger. */
export const BANK_ACCOUNT_LABEL = "Bank";

/**
 * Adjust the Bank bucket: positive delta = more cash (contributions), negative = less (deductions).
 */
export async function adjustBankBalance(delta: number): Promise<void> {
  if (delta === 0 || Number.isNaN(delta) || !Number.isFinite(delta)) return;
  const res = await AccountDistribution.findOneAndUpdate(
    { label: BANK_ACCOUNT_LABEL },
    { $inc: { amount: delta }, $set: { updatedAt: new Date() } },
  );
  if (!res) {
    console.warn(
      `[account-bank] No "${BANK_ACCOUNT_LABEL}" account — skipped delta ${delta}`,
    );
  }
}
