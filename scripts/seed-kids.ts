/**
 * Seed script — Kids Account (kids-account DB)
 * Run: npm run seed:kids
 *
 * Idempotent: clears transactions and Kids settings, then loads the full ledger
 * (same data as scripts/seed-kids-account.ts).
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

/** Same cluster as savings; use `kids-account` in the DB path. */
const MONGODB_URI =
  process.env.MONGODB_KIDS_URI ||
  (process.env.MONGODB_URI?.includes("kids-account")
    ? process.env.MONGODB_URI
    : undefined) ||
  "mongodb://localhost:27017/kids-account";

const transactionSchema = new mongoose.Schema(
  {
    date: { type: Date, default: null },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ["INCOME", "EXPENSE"] },
    amount: { type: Number, required: true },
    isCarryForward: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

const kidsSettingsSchema = new mongoose.Schema(
  {
    accountName: { type: String, required: true, default: "Kids Account" },
    ownerName: { type: String, default: "" },
    partnerName: { type: String, default: "" },
    currency: { type: String, required: true, default: "CAD" },
  },
  { timestamps: true },
);

const d = (s: string) => new Date(s);

// ─── Income Transactions ─────────────────────────────────────────────────────

const income = [
  // ── Carry-forward opening balance ──
  { date: d("2023-09-10"), description: "Income to date",   category: "Other Income",     type: "INCOME", amount:  35827.21, isCarryForward: true,  tags: ["carry-forward"] },

  // ── CCB ──
  { date: d("2026-03-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2026-02-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2026-01-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-24"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-22"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-21"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-19"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-12-18"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-02-22"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-01-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2025-01-19"), description: "CCB", category: "CCB", type: "INCOME", amount: 377,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-21"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-21"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-21"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 926.67,  isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 733,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-19"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-19"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-19"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-18"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-12-16"), description: "CCB", category: "CCB", type: "INCOME", amount: 359,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2024-02-17"), description: "CCB", category: "CCB", type: "INCOME", amount: 733,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-21"), description: "CCB", category: "CCB", type: "INCOME", amount: 2035,    isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 2035,    isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-18"), description: "CCB", category: "CCB", type: "INCOME", amount: 926.67,  isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-12-18"), description: "CCB", category: "CCB", type: "INCOME", amount: 926,     isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-03-20"), description: "CCB", category: "CCB", type: "INCOME", amount: 2035,    isCarryForward: false, tags: ["CCB"] },
  { date: d("2023-01-13"), description: "CCB", category: "CCB", type: "INCOME", amount: 926.67,  isCarryForward: false, tags: ["CCB"] },

  // ── Government credits & rebates ──
  { date: d("2025-12-22"), description: "Carbon Rebate",  category: "Carbon Rebate",      type: "INCOME", amount: 339,    isCarryForward: false, tags: [] },
  { date: d("2025-12-15"), description: "Carbon Rebates", category: "Carbon Rebate",      type: "INCOME", amount: 315,    isCarryForward: false, tags: [] },
  { date: d("2025-10-28"), description: "Ontario",        category: "Government Benefit",  type: "INCOME", amount: 600,    isCarryForward: false, tags: [] },
  { date: d("2025-09-27"), description: "Tax Return",     category: "Tax Return",          type: "INCOME", amount: 1867,   isCarryForward: false, tags: [] },
  { date: d("2024-12-13"), description: "Carbon Rebate",  category: "Carbon Rebate",      type: "INCOME", amount: 315,    isCarryForward: false, tags: [] },
  { date: d("2024-09-15"), description: "Carbon Rebate",  category: "Carbon Rebate",      type: "INCOME", amount: 315,    isCarryForward: false, tags: [] },
  { date: d("2024-06-13"), description: "Carbon Rebate",  category: "Carbon Rebate",      type: "INCOME", amount: 315,    isCarryForward: false, tags: [] },
  { date: d("2024-03-13"), description: "Climate",        category: "Carbon Rebate",      type: "INCOME", amount: 274,    isCarryForward: false, tags: [] },
  { date: d("2023-12-14"), description: "CAI",            category: "Carbon Rebate",      type: "INCOME", amount: 274,    isCarryForward: false, tags: [] },
  { date: d("2023-10-13"), description: "GST",            category: "GST",                type: "INCOME", amount: 135,    isCarryForward: false, tags: [] },
  { date: d("2023-06-14"), description: "Climate",        category: "Carbon Rebate",      type: "INCOME", amount: 274,    isCarryForward: false, tags: [] },
  { date: d("2023-05-31"), description: "GST(Quarterly)", category: "GST",                type: "INCOME", amount: 547.5,  isCarryForward: false, tags: [] },
  { date: d("2023-01-14"), description: "CIA",            category: "Government Benefit",  type: "INCOME", amount: 274.5,  isCarryForward: false, tags: [] },
  { date: d("2023-01-14"), description: "GST",            category: "GST",                type: "INCOME", amount: 135,    isCarryForward: false, tags: [] },
];

// ─── Expense Transactions ─────────────────────────────────────────────────────

const expenses = [
  // ── Carry-forward opening expenses ──
  { date: d("2023-07-10"), description: "Expense to Date",             category: "Others",        type: "EXPENSE", amount: -22205.72, isCarryForward: true,  tags: ["carry-forward"] },

  // ── 2026 ──
  { date: d("2026-04-13"), description: "GAP",                         category: "Clothing",      type: "EXPENSE", amount: -52.75,  isCarryForward: false, tags: [] },
  { date: d("2026-03-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2026-03-14"), description: "Old Navy",                    category: "Clothing",      type: "EXPENSE", amount: -94,     isCarryForward: false, tags: [] },
  { date: d("2026-02-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2026-01-27"), description: "Clothing",                    category: "Clothing",      type: "EXPENSE", amount: -141,    isCarryForward: false, tags: [] },
  { date: d("2026-01-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2026-08-31"), description: "Sweater",                     category: "Clothing",      type: "EXPENSE", amount: -41,     isCarryForward: false, tags: [] },

  // ── 2025 ──
  { date: d("2025-12-31"), description: "Hoodie REM",                  category: "Clothing",      type: "EXPENSE", amount: -92.36,  isCarryForward: false, tags: [] },
  { date: d("2025-12-31"), description: "Stationery",                  category: "Personal",      type: "EXPENSE", amount: -36,     isCarryForward: false, tags: [] },
  { date: d("2025-12-31"), description: "Excursion",                   category: "Transport",     type: "EXPENSE", amount: -60,     isCarryForward: false, tags: [] },
  { date: d("2025-12-28"), description: "Winter Jacket Twins",         category: "Clothing",      type: "EXPENSE", amount: -250,    isCarryForward: false, tags: [] },
  { date: d("2025-12-27"), description: "Winter Gloves",               category: "Personal",      type: "EXPENSE", amount: -35.68,  isCarryForward: false, tags: [] },
  { date: d("2025-12-26"), description: "Uniform",                     category: "Clothing",      type: "EXPENSE", amount: -81,     isCarryForward: false, tags: [] },
  { date: d("2025-12-26"), description: "Year Book",                   category: "Others",        type: "EXPENSE", amount: -60,     isCarryForward: false, tags: [] },
  { date: d("2025-12-23"), description: "Shoes",                       category: "Clothing",      type: "EXPENSE", amount: -111.64, isCarryForward: false, tags: [] },
  { date: d("2025-12-21"), description: "Fun Fair",                    category: "Entertainment", type: "EXPENSE", amount: -105,    isCarryForward: false, tags: [] },
  { date: d("2025-12-21"), description: "School Supplies",             category: "Others",        type: "EXPENSE", amount: -619.62, isCarryForward: false, tags: [] },
  { date: d("2025-12-17"), description: "Blankets",                    category: "Housing",       type: "EXPENSE", amount: -119,    isCarryForward: false, tags: [] },
  { date: d("2025-12-16"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-12-13"), description: "HeatTech(3)",                 category: "Clothing",      type: "EXPENSE", amount: -78.45,  isCarryForward: false, tags: [] },
  { date: d("2025-12-13"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-11-02"), description: "Calculator + Dry Erase Marker", category: "Others",     type: "EXPENSE", amount: -33.31,  isCarryForward: false, tags: [] },
  { date: d("2025-08-31"), description: "Miscellaneous",               category: "Others",        type: "EXPENSE", amount: -141.73, isCarryForward: false, tags: [] },
  { date: d("2025-08-28"), description: "Hoodie",                      category: "Clothing",      type: "EXPENSE", amount: -49.37,  isCarryForward: false, tags: [] },
  { date: d("2025-08-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-07-28"), description: "School Pants",                category: "Clothing",      type: "EXPENSE", amount: -26.76,  isCarryForward: false, tags: [] },
  { date: d("2025-05-31"), description: "Tights+Tees",                 category: "Clothing",      type: "EXPENSE", amount: -98.45,  isCarryForward: false, tags: [] },
  { date: d("2025-01-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2025-01-14"), description: "Tees for Twins",              category: "Entertainment", type: "EXPENSE", amount: -12.99,  isCarryForward: false, tags: [] },
  { date: d("2025-01-14"), description: "Thermal Leggings",            category: "Clothing",      type: "EXPENSE", amount: -30,     isCarryForward: false, tags: [] },
  { date: d("2025-01-14"), description: "Elaine Uniform",              category: "Clothing",      type: "EXPENSE", amount: -50,     isCarryForward: false, tags: [] },

  // ── 2024 ──
  { date: d("2024-12-26"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -400,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-22"), description: "Ann Insurance",               category: "Insurance",     type: "EXPENSE", amount: -67.14,  isCarryForward: false, tags: [] },
  { date: d("2024-12-21"), description: "Birthday Gift",               category: "Entertainment", type: "EXPENSE", amount: -39,     isCarryForward: false, tags: [] },
  { date: d("2024-12-20"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -522.48, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2024-12-18"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -522.48, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2024-12-16"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-16"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -572.24, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2024-12-15"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -497.60, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2024-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-15"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -522.48, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2024-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-12-13"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-08-31"), description: "Playground Fund",             category: "Others",        type: "EXPENSE", amount: -150,    isCarryForward: false, tags: [] },
  { date: d("2024-04-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-02-29"), description: "Ann Insurance",               category: "Insurance",     type: "EXPENSE", amount: -67,     isCarryForward: false, tags: [] },
  { date: d("2024-01-31"), description: "Bedsheets, swimming suit",    category: "Housing",       type: "EXPENSE", amount: -82.61,  isCarryForward: false, tags: [] },
  { date: d("2024-01-27"), description: "Grocery Bag",                 category: "Food",          type: "EXPENSE", amount: -99.98,  isCarryForward: false, tags: [] },
  { date: d("2024-01-16"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -324,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2024-01-15"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -572.24, isCarryForward: false, tags: ["YMCA"] },

  // ── 2023 ──
  { date: d("2023-12-31"), description: "Foodstuff from Nigeria",      category: "Food",          type: "EXPENSE", amount: -527,    isCarryForward: false, tags: [] },
  { date: d("2023-12-31"), description: "Household Utensils",          category: "Housing",       type: "EXPENSE", amount: -33.09,  isCarryForward: false, tags: [] },
  { date: d("2023-12-31"), description: "Kids Clothing",               category: "Clothing",      type: "EXPENSE", amount: -75,     isCarryForward: false, tags: [] },
  { date: d("2023-12-30"), description: "Children Tops",               category: "Clothing",      type: "EXPENSE", amount: -45,     isCarryForward: false, tags: [] },
  { date: d("2023-12-30"), description: "Ann Insurance",               category: "Insurance",     type: "EXPENSE", amount: -67.14,  isCarryForward: false, tags: [] },
  { date: d("2023-12-30"), description: "Bedsheets",                   category: "Housing",       type: "EXPENSE", amount: -50,     isCarryForward: false, tags: [] },
  { date: d("2023-12-30"), description: "Summerfest",                  category: "Entertainment", type: "EXPENSE", amount: -100,    isCarryForward: false, tags: [] },
  { date: d("2023-12-29"), description: "Books for Elaine",            category: "Entertainment", type: "EXPENSE", amount: -29.96,  isCarryForward: false, tags: [] },
  { date: d("2023-12-27"), description: "Kids outing",                 category: "Transport",     type: "EXPENSE", amount: -100,    isCarryForward: false, tags: [] },
  { date: d("2023-12-27"), description: "Christmas Tree",              category: "Entertainment", type: "EXPENSE", amount: -82.47,  isCarryForward: false, tags: [] },
  { date: d("2023-12-26"), description: "Fleece lined joggers",        category: "Clothing",      type: "EXPENSE", amount: -87.22,  isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "Uber Hospital",               category: "Medical",       type: "EXPENSE", amount: -11,     isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "Uniform Walmart",             category: "Clothing",      type: "EXPENSE", amount: -37,     isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "School Uniform Bottoms",      category: "Clothing",      type: "EXPENSE", amount: -149,    isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "Sneakers Kids",               category: "Clothing",      type: "EXPENSE", amount: -145,    isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "Carter Twins",                category: "Clothing",      type: "EXPENSE", amount: -32,     isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "Lizabella+ Gabby",            category: "Entertainment", type: "EXPENSE", amount: -58.98,  isCarryForward: false, tags: [] },
  { date: d("2023-12-25"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -2000,   isCarryForward: false, tags: ["YMCA"] },
  { date: d("2023-12-25"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -2000,   isCarryForward: false, tags: ["YMCA"] },
  { date: d("2023-12-24"), description: "Snow Pant",                   category: "Clothing",      type: "EXPENSE", amount: -62.25,  isCarryForward: false, tags: [] },
  { date: d("2023-12-24"), description: "Summerfest",                  category: "Entertainment", type: "EXPENSE", amount: -208.18, isCarryForward: false, tags: [] },
  { date: d("2023-12-24"), description: "Naija Food",                  category: "Food",          type: "EXPENSE", amount: -405,    isCarryForward: false, tags: [] },
  { date: d("2023-12-24"), description: "Elaine School Trip",          category: "Transport",     type: "EXPENSE", amount: -20,     isCarryForward: false, tags: [] },
  { date: d("2023-12-24"), description: "Drugs+Uber",                  category: "Medical",       type: "EXPENSE", amount: -205.62, isCarryForward: false, tags: [] },
  { date: d("2023-12-23"), description: "Table + Drawer + Uber",       category: "Housing",       type: "EXPENSE", amount: -426.72, isCarryForward: false, tags: [] },
  { date: d("2023-12-23"), description: "Bedsheets for the girls",     category: "Housing",       type: "EXPENSE", amount: -58.41,  isCarryForward: false, tags: [] },
  { date: d("2023-12-22"), description: "Wardrobe Rug",                category: "Utilities",     type: "EXPENSE", amount: -33.89,  isCarryForward: false, tags: [] },
  { date: d("2023-12-22"), description: "Halloween School Snack",      category: "Entertainment", type: "EXPENSE", amount: -30,     isCarryForward: false, tags: [] },
  { date: d("2023-12-21"), description: "Gift Christabel",             category: "Entertainment", type: "EXPENSE", amount: -34,     isCarryForward: false, tags: [] },
  { date: d("2023-12-21"), description: "Uber to Christabel",          category: "Transport",     type: "EXPENSE", amount: -42,     isCarryForward: false, tags: [] },
  { date: d("2023-12-20"), description: "Uber",                        category: "Transport",     type: "EXPENSE", amount: -18.91,  isCarryForward: false, tags: [] },
  { date: d("2023-12-20"), description: "Halloween",                   category: "Entertainment", type: "EXPENSE", amount: -75,     isCarryForward: false, tags: [] },
  { date: d("2023-12-20"), description: "Jeans for Kids",              category: "Clothing",      type: "EXPENSE", amount: -52.06,  isCarryForward: false, tags: [] },
  { date: d("2023-12-20"), description: "Insurance",                   category: "Insurance",     type: "EXPENSE", amount: -67.14,  isCarryForward: false, tags: [] },
  { date: d("2023-12-20"), description: "Insurance",                   category: "Insurance",     type: "EXPENSE", amount: -67.14,  isCarryForward: false, tags: [] },
  { date: d("2023-12-20"), description: "Orfe Art",                    category: "Entertainment", type: "EXPENSE", amount: -136,    isCarryForward: false, tags: [] },
  { date: d("2023-12-18"), description: "Lunch + Dinner",              category: "Food",          type: "EXPENSE", amount: -96.99,  isCarryForward: false, tags: [] },
  { date: d("2023-12-18"), description: "Gloves + Top for Twins",      category: "Clothing",      type: "EXPENSE", amount: -35,     isCarryForward: false, tags: [] },
  { date: d("2023-12-18"), description: "Lego Program",                category: "Others",        type: "EXPENSE", amount: -203.40, isCarryForward: false, tags: [] },
  { date: d("2023-12-17"), description: "Kids Hair",                   category: "Personal",      type: "EXPENSE", amount: -30,     isCarryForward: false, tags: [] },
  { date: d("2023-12-17"), description: "Birthday Gift",               category: "Entertainment", type: "EXPENSE", amount: -50,     isCarryForward: false, tags: [] },
  { date: d("2023-12-17"), description: "Kids Jacket",                 category: "Clothing",      type: "EXPENSE", amount: -76.13,  isCarryForward: false, tags: [] },
  { date: d("2023-12-17"), description: "Uber to Ani's",               category: "Transport",     type: "EXPENSE", amount: -95.5,   isCarryForward: false, tags: [] },
  { date: d("2023-12-16"), description: "Pizza Lunch",                 category: "Food",          type: "EXPENSE", amount: -60,     isCarryForward: false, tags: [] },
  { date: d("2023-12-16"), description: "Children Clothes",            category: "Clothing",      type: "EXPENSE", amount: -192.76, isCarryForward: false, tags: [] },
  { date: d("2023-12-16"), description: "Insurance",                   category: "Insurance",     type: "EXPENSE", amount: -49.19,  isCarryForward: false, tags: [] },
  { date: d("2023-12-16"), description: "Books for Twins",             category: "Entertainment", type: "EXPENSE", amount: -66.15,  isCarryForward: false, tags: [] },
  { date: d("2023-12-16"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-16"), description: "Shoes (Twins)",               category: "Clothing",      type: "EXPENSE", amount: -50.4,   isCarryForward: false, tags: [] },
  { date: d("2023-12-16"), description: "Elaine Skechers",             category: "Clothing",      type: "EXPENSE", amount: -63,     isCarryForward: false, tags: [] },
  { date: d("2023-12-15"), description: "Mark's & Spencer School Return", category: "Clothing",   type: "EXPENSE", amount: -200,    isCarryForward: false, tags: [] },
  { date: d("2023-12-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-15"), description: "Insurance",                   category: "Insurance",     type: "EXPENSE", amount: -49.19,  isCarryForward: false, tags: [] },
  { date: d("2023-12-15"), description: "Orfe Art",                    category: "Entertainment", type: "EXPENSE", amount: -136,    isCarryForward: false, tags: [] },
  { date: d("2023-12-14"), description: "Insurance",                   category: "Insurance",     type: "EXPENSE", amount: -49.19,  isCarryForward: false, tags: [] },
  { date: d("2023-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-14"), description: "Twins Jeans",                 category: "Clothing",      type: "EXPENSE", amount: -31.48,  isCarryForward: false, tags: [] },
  { date: d("2023-12-14"), description: "Elaine Winter Coat",          category: "Clothing",      type: "EXPENSE", amount: -64.97,  isCarryForward: false, tags: [] },
  { date: d("2023-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-14"), description: "Pizza Tuesday",               category: "Food",          type: "EXPENSE", amount: -66,     isCarryForward: false, tags: [] },
  { date: d("2023-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-14"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-13"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-13"), description: "Skates + Gear",               category: "Entertainment", type: "EXPENSE", amount: -97.16,  isCarryForward: false, tags: [] },
  { date: d("2023-12-13"), description: "Isang",                       category: "Transport",     type: "EXPENSE", amount: -50,     isCarryForward: false, tags: [] },
  { date: d("2023-12-12"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-12-06"), description: "School Uniforms",             category: "Clothing",      type: "EXPENSE", amount: -210,    isCarryForward: false, tags: [] },
  { date: d("2023-10-31"), description: "Hats+Neckwarmer",             category: "Entertainment", type: "EXPENSE", amount: -30,     isCarryForward: false, tags: [] },
  { date: d("2023-10-31"), description: "Hoodie Jacket",               category: "Clothing",      type: "EXPENSE", amount: -146.69, isCarryForward: false, tags: [] },
  { date: d("2023-10-31"), description: "Scientist in Class",          category: "Others",        type: "EXPENSE", amount: -30,     isCarryForward: false, tags: [] },
  { date: d("2023-10-22"), description: "Funfair",                     category: "Entertainment", type: "EXPENSE", amount: -55,     isCarryForward: false, tags: [] },
  { date: d("2023-09-16"), description: "School Agenda + Sandwich",    category: "Others",        type: "EXPENSE", amount: -60,     isCarryForward: false, tags: [] },
  { date: d("2023-09-15"), description: "Uber kids",                   category: "Transport",     type: "EXPENSE", amount: -56,     isCarryForward: false, tags: [] },
  { date: d("2023-08-29"), description: "Gift card + Kids wear",       category: "Clothing",      type: "EXPENSE", amount: -116.83, isCarryForward: false, tags: [] },
  { date: d("2023-08-25"), description: "Hat + Sweatshirt",            category: "Clothing",      type: "EXPENSE", amount: -59.56,  isCarryForward: false, tags: [] },
  { date: d("2023-08-21"), description: "Loan to Ikenna",              category: "Personal",      type: "EXPENSE", amount: -500,    isCarryForward: false, tags: [] },
  { date: d("2023-08-21"), description: "Elaine Shors",                category: "Clothing",      type: "EXPENSE", amount: -65.67,  isCarryForward: false, tags: [] },
  { date: d("2023-08-18"), description: "Kid Matress",                 category: "Housing",       type: "EXPENSE", amount: -549.15, isCarryForward: false, tags: [] },
  { date: d("2023-07-31"), description: "Mc Donald's",                 category: "Food",          type: "EXPENSE", amount: -23.35,  isCarryForward: false, tags: [] },
  { date: d("2023-07-31"), description: "No Frills",                   category: "Food",          type: "EXPENSE", amount: -21,     isCarryForward: false, tags: [] },
  { date: d("2023-07-22"), description: "Mattress Vacuum Bag",         category: "Housing",       type: "EXPENSE", amount: -45.19,  isCarryForward: false, tags: [] },
  { date: d("2023-07-21"), description: "Bunk Beds",                   category: "Housing",       type: "EXPENSE", amount: -796.60, isCarryForward: false, tags: [] },
  { date: d("2023-07-18"), description: "PJs",                         category: "Entertainment", type: "EXPENSE", amount: -50.42,  isCarryForward: false, tags: [] },
  { date: d("2023-07-17"), description: "Children Summer Gear",        category: "Entertainment", type: "EXPENSE", amount: -205,    isCarryForward: false, tags: [] },
  { date: d("2023-07-03"), description: "Sneakers",                    category: "Clothing",      type: "EXPENSE", amount: -117,    isCarryForward: false, tags: [] },
  { date: d("2023-06-29"), description: "Shoe rack",                   category: "Housing",       type: "EXPENSE", amount: -67.79,  isCarryForward: false, tags: [] },
  { date: d("2023-06-23"), description: "Uber",                        category: "Transport",     type: "EXPENSE", amount: -22.31,  isCarryForward: false, tags: [] },
  { date: d("2023-06-12"), description: "Color Clothing School",       category: "Clothing",      type: "EXPENSE", amount: -42,     isCarryForward: false, tags: [] },
  { date: d("2023-05-31"), description: "Twin School Bags",            category: "Others",        type: "EXPENSE", amount: -67.04,  isCarryForward: false, tags: [] },
  { date: d("2023-05-28"), description: "Elaine Shoes",                category: "Clothing",      type: "EXPENSE", amount: -53,     isCarryForward: false, tags: [] },
  { date: d("2023-05-15"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -522.48, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2023-05-13"), description: "Clothing",                    category: "Clothing",      type: "EXPENSE", amount: -130,    isCarryForward: false, tags: [] },
  { date: d("2023-04-27"), description: "Uber",                        category: "Transport",     type: "EXPENSE", amount: -21,     isCarryForward: false, tags: [] },
  { date: d("2023-04-27"), description: "Freezer",                     category: "Utilities",     type: "EXPENSE", amount: -483.64, isCarryForward: false, tags: [] },
  { date: d("2023-04-23"), description: "Santa Photo",                 category: "Entertainment", type: "EXPENSE", amount: -15,     isCarryForward: false, tags: [] },
  { date: d("2023-04-15"), description: "YMCA Balance",                category: "YMCA",          type: "EXPENSE", amount: -369.13, isCarryForward: false, tags: ["YMCA"] },
  { date: d("2023-03-31"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -2000,   isCarryForward: false, tags: ["YMCA"] },
  { date: d("2023-03-31"), description: "Uber",                        category: "Transport",     type: "EXPENSE", amount: -16,     isCarryForward: false, tags: [] },
  { date: d("2023-03-31"), description: "Drug",                        category: "Medical",       type: "EXPENSE", amount: -15.05,  isCarryForward: false, tags: [] },
  { date: d("2023-03-31"), description: "Excursion",                   category: "Transport",     type: "EXPENSE", amount: -60,     isCarryForward: false, tags: [] },
  { date: d("2023-03-29"), description: "Elaine Birthday",             category: "Entertainment", type: "EXPENSE", amount: -55,     isCarryForward: false, tags: [] },
  { date: d("2023-03-18"), description: "Uber",                        category: "Transport",     type: "EXPENSE", amount: -64.74,  isCarryForward: false, tags: [] },
  { date: d("2023-03-15"), description: "RESP",                        category: "RESP",          type: "EXPENSE", amount: -624,    isCarryForward: false, tags: ["RESP"] },
  { date: d("2023-02-23"), description: "Ann Insurance",               category: "Insurance",     type: "EXPENSE", amount: -67,     isCarryForward: false, tags: [] },
  { date: d("2023-01-28"), description: "Children Hair",               category: "Personal",      type: "EXPENSE", amount: -67.72,  isCarryForward: false, tags: [] },
  { date: d("2023-01-27"), description: "Zoo Registration",            category: "Entertainment", type: "EXPENSE", amount: -277,    isCarryForward: false, tags: [] },
  { date: d("2023-01-23"), description: "Clothing",                    category: "Clothing",      type: "EXPENSE", amount: -85,     isCarryForward: false, tags: [] },
  { date: d("2023-01-23"), description: "Uber Hospital",               category: "Transport",     type: "EXPENSE", amount: -38,     isCarryForward: false, tags: [] },
  { date: d("2023-01-17"), description: "Jacket + Gloves",             category: "Clothing",      type: "EXPENSE", amount: -164.96, isCarryForward: false, tags: [] },
  { date: d("2023-01-17"), description: "Pants",                       category: "Clothing",      type: "EXPENSE", amount: -46.96,  isCarryForward: false, tags: [] },
  { date: d("2023-01-14"), description: "Eat Out",                     category: "Food",          type: "EXPENSE", amount: -56.85,  isCarryForward: false, tags: [] },
  { date: d("2023-01-01"), description: "BedFrame",                    category: "Housing",       type: "EXPENSE", amount: -607.94, isCarryForward: false, tags: [] },
  { date: d("2023-01-02"), description: "Picnic mat",                  category: "Entertainment", type: "EXPENSE", amount: -61.91,  isCarryForward: false, tags: [] },
  { date: d("2023-01-03"), description: "Allergy Medication",          category: "Medical",       type: "EXPENSE", amount: -12.67,  isCarryForward: false, tags: [] },
  { date: d("2023-01-04"), description: "Canada Day Clothes",          category: "Clothing",      type: "EXPENSE", amount: -29.69,  isCarryForward: false, tags: [] },
  { date: d("2023-01-05"), description: "Groceries",                   category: "Food",          type: "EXPENSE", amount: -26.57,  isCarryForward: false, tags: [] },
  { date: d("2023-01-06"), description: "Hair Care",                   category: "Personal",      type: "EXPENSE", amount: -66,     isCarryForward: false, tags: [] },
  { date: d("2023-01-07"), description: "Canada Day",                  category: "Entertainment", type: "EXPENSE", amount: -50.49,  isCarryForward: false, tags: [] },
  { date: d("2023-01-08"), description: "Zoo Snacks",                  category: "Food",          type: "EXPENSE", amount: -34.07,  isCarryForward: false, tags: [] },
  { date: d("2023-01-09"), description: "Uber to Zoo",                 category: "Transport",     type: "EXPENSE", amount: -60.43,  isCarryForward: false, tags: [] },
  { date: d("2023-01-10"), description: "Hair Dryer",                  category: "Personal",      type: "EXPENSE", amount: -30,     isCarryForward: false, tags: [] },
  { date: d("2023-01-11"), description: "Norton Family",               category: "Entertainment", type: "EXPENSE", amount: -50,     isCarryForward: false, tags: [] },
  { date: d("2023-01-12"), description: "Uber",                        category: "Transport",     type: "EXPENSE", amount: -8.18,   isCarryForward: false, tags: [] },
  { date: d("2023-01-13"), description: "Christmas Sweater",           category: "Clothing",      type: "EXPENSE", amount: -53.91,  isCarryForward: false, tags: [] },
  { date: d("2023-01-14"), description: "Uber Birthday",               category: "Transport",     type: "EXPENSE", amount: -56.59,  isCarryForward: false, tags: [] },
  { date: d("2023-01-15"), description: "YMCA",                        category: "YMCA",          type: "EXPENSE", amount: -520,    isCarryForward: false, tags: ["YMCA"] },
  { date: d("2023-01-16"), description: "Snow Pants",                  category: "Clothing",      type: "EXPENSE", amount: -72,     isCarryForward: false, tags: [] },
];

async function seed() {
  console.log("🔌 Connecting to MongoDB (kids-account)...");
  const conn = await mongoose.createConnection(MONGODB_URI).asPromise();
  console.log("✅ Connected.");

  const Transaction = conn.model("Transaction", transactionSchema);
  const KidsSettings = conn.model("KidsSettings", kidsSettingsSchema);

  await Transaction.deleteMany({});
  await KidsSettings.deleteMany({});
  console.log("🧹 Cleared existing data.");

  const allTransactions = [
    ...income.map((t) => ({ ...t, type: "INCOME" as const })),
    ...expenses.map((t) => ({ ...t, type: "EXPENSE" as const })),
  ];

  await Transaction.insertMany(allTransactions);
  console.log(
    `💳 Inserted ${allTransactions.length} transactions (${income.length} income, ${expenses.length} expenses).`,
  );

  await KidsSettings.create({
    accountName: "Kids Account",
    ownerName: "Kere",
    partnerName: "Ann",
    currency: "CAD",
  });
  console.log("⚙️  Inserted settings.");

  const totalInc = income.reduce((s, t) => s + t.amount, 0);
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
  console.log("\n✅ Seed complete!");
  console.log(`   Income total:   $${totalInc.toFixed(2)}`);
  console.log(`   Expense total:  $${totalExp.toFixed(2)}`);
  console.log(`   Net balance:    $${(totalInc + totalExp).toFixed(2)}`);

  await conn.close();
}

seed().catch((err) => {
  console.error("❌ Kids seed failed:", err);
  process.exit(1);
});
