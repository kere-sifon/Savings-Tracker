import { z } from "zod";

export const INCOME_CATEGORIES = [
  "CCB",
  "Carbon Rebate",
  "GST",
  "Tax Return",
  "Government Benefit",
  "Other Income",
] as const;

export const EXPENSE_CATEGORIES = [
  "RESP",
  "YMCA",
  "Clothing",
  "Food",
  "Housing",
  "Transport",
  "Entertainment",
  "Medical",
  "Personal",
  "Insurance",
  "Utilities",
  "Savings",
  "Others",
] as const;

export const transactionBodySchema = z.object({
  date: z.union([z.string(), z.null()]).optional(),
  description: z.string().min(1),
  category: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().finite(),
  tags: z.array(z.string()).optional().default([]),
  isCarryForward: z.boolean().optional().default(false),
});

export type TransactionBody = z.infer<typeof transactionBodySchema>;
