import { z } from "zod";
import { MONTHS } from "@/lib/months";

const monthEnum = z.enum(MONTHS as unknown as [string, ...string[]]);

export const deductionBodySchema = z
  .object({
    year: z.coerce.number(),
    month: monthEnum,
    amount: z.coerce.number(),
    description: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!Number.isFinite(data.year)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a year",
        path: ["year"],
      });
    } else if (data.year < 2000 || data.year > 2100) {
      ctx.addIssue({
        code: "custom",
        message: "Year must be between 2000 and 2100",
        path: ["year"],
      });
    }
    if (!Number.isFinite(data.amount) || Number.isNaN(data.amount)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter an amount",
        path: ["amount"],
      });
    } else if (data.amount < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Amount cannot be negative",
        path: ["amount"],
      });
    }
  });

export type DeductionBody = z.infer<typeof deductionBodySchema>;
