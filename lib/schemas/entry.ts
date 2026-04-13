import { z } from "zod";
import { MONTHS } from "@/lib/months";

const monthEnum = z.enum(MONTHS as unknown as [string, ...string[]]);

export const monthlyEntryInputSchema = z
  .object({
    year: z.coerce.number(),
    month: monthEnum,
    kere: z.coerce.number(),
    ann: z.coerce.number(),
    note: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!Number.isFinite(data.year) || Number.isNaN(data.year)) {
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
    if (!Number.isFinite(data.kere) || Number.isNaN(data.kere)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter Kere amount",
        path: ["kere"],
      });
    } else if (data.kere < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Kere cannot be negative",
        path: ["kere"],
      });
    }
    if (!Number.isFinite(data.ann) || Number.isNaN(data.ann)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter Ann amount",
        path: ["ann"],
      });
    } else if (data.ann < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Ann cannot be negative",
        path: ["ann"],
      });
    }
  });

export type MonthlyEntryInput = z.infer<typeof monthlyEntryInputSchema>;
