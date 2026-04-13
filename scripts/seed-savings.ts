/**
 * Seed script — Savings Tracker (savings-tracker DB)
 * Run: npm run seed  /  npx tsx scripts/seed-savings.ts
 *
 * Idempotent: clears existing data before inserting.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_SAVINGS_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/savings-tracker";

const MonthlyEntry = mongoose.model(
  "MonthlyEntry",
  new mongoose.Schema({
    year: Number,
    month: String,
    kere: { type: Number, default: 0 },
    ann: { type: Number, default: 0 },
    note: { type: String, default: null },
  }),
);

const Deduction = mongoose.model(
  "Deduction",
  new mongoose.Schema(
    {
      year: Number,
      month: String,
      amount: { type: Number, required: true },
      description: { type: String, required: true },
    },
    { timestamps: true },
  ),
);

const AccountDistribution = mongoose.model(
  "AccountDistribution",
  new mongoose.Schema({
    label: String,
    amount: Number,
    updatedAt: { type: Date, default: Date.now },
  }),
);

const LineOfCredit = mongoose.model(
  "LineOfCredit",
  new mongoose.Schema({
    name: String,
    balance: Number,
    updatedAt: { type: Date, default: Date.now },
  }),
);

const Settings = mongoose.model(
  "Settings",
  new mongoose.Schema({
    startingBalance: Number,
    partner1Name: String,
    partner2Name: String,
  }),
);

type DeductionSeed = { amount: number; description: string };

const monthlyEntries: {
  year: number;
  month: string;
  kere: number;
  ann: number;
  note: string | null;
  deductions: DeductionSeed[];
}[] = [
  { year: 2022, month: "March",     kere: 2650, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP January" }] },
  { year: 2022, month: "April",     kere: 2650, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP February" }] },
  { year: 2022, month: "May",       kere: 2650, ann: 0,    note: null, deductions: [{ amount: 91.48,  description: "Citizenship Application Passport Photos" }] },
  { year: 2022, month: "June",      kere: 2500, ann: 0,    note: null, deductions: [{ amount: 1560,   description: "Citizenship Application" }] },
  { year: 2022, month: "July",      kere: 2500, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP March" }] },
  { year: 2022, month: "August",    kere: 2500, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP April" }] },
  { year: 2022, month: "September", kere: 2500, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP May" }] },
  { year: 2022, month: "October",   kere: 2500, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP June" }] },
  { year: 2022, month: "November",  kere: 2500, ann: 0,    note: null, deductions: [{ amount: 300,    description: "RESP July" }] },
  { year: 2022, month: "December",  kere: 2500, ann: 1500, note: null, deductions: [{ amount: 91.48,  description: "Passport Application Passport Photos" }] },
  { year: 2023, month: "January",   kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP August" }] },
  { year: 2023, month: "February",  kere: 2500, ann: 1500, note: null, deductions: [{ amount: 491,    description: "Passport Fee" }] },
  { year: 2023, month: "March",     kere: 5000, ann: 1500, note: null, deductions: [{ amount: 216.8,  description: "Dental Check" }] },
  { year: 2023, month: "April",     kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP September" }] },
  { year: 2023, month: "May",       kere: 2500, ann: 1500, note: null, deductions: [{ amount: 1289.1, description: "Elaine's Birthday" }] },
  { year: 2023, month: "June",      kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP October" }] },
  { year: 2023, month: "July",      kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP November" }] },
  { year: 2023, month: "August",    kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP December" }] },
  { year: 2023, month: "September", kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP January 2026" }] },
  { year: 2023, month: "October",   kere: 2500, ann: 1500, note: null, deductions: [{ amount: 1838,   description: "Ann for Muscle Repair" }] },
  { year: 2023, month: "November",  kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP February 2026" }] },
  { year: 2023, month: "December",  kere: 2500, ann: 1500, note: null, deductions: [{ amount: 650,    description: "Grandparents Rent" }] },
  { year: 2024, month: "January",   kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP March 2026" }] },
  { year: 2024, month: "February",  kere: 2500, ann: 1500, note: null, deductions: [{ amount: 300,    description: "RESP April 2026" }] },
  { year: 2024, month: "March",     kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "April",     kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "May",       kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "June",      kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "July",      kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "August",    kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "September", kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "October",   kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "November",  kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2024, month: "December",  kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2025, month: "January",   kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2025, month: "February",  kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2025, month: "March",     kere: 2500, ann: 1500, note: null, deductions: [] },
  { year: 2025, month: "April",     kere: 0,    ann: 0,    note: "GIC Maturity", deductions: [] },
  { year: 2025, month: "May",       kere: 2500, ann: 0,    note: null, deductions: [] },
  { year: 2025, month: "June",      kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2025, month: "July",      kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2025, month: "August",    kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2025, month: "September", kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2025, month: "October",   kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2025, month: "November",  kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2025, month: "December",  kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2026, month: "January",   kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2026, month: "February",  kere: 2500, ann: 1550, note: null, deductions: [] },
  { year: 2026, month: "March",     kere: 2500, ann: 1550, note: null, deductions: [] },
];

const accountDistributions = [
  { label: "GIC",        amount: 70000.00 },
  { label: "FSHA",       amount: 48000.00 },
  { label: "Bank",       amount: 54006.05 },
  { label: "GIC Return", amount: 4186.78  },
];

const linesOfCredit = [
  { name: "TD Line of Credit",  balance: 50000 },
  { name: "BMO Line of Credit", balance: 10000 },
];

const settings = {
  startingBalance: 10550,
  partner1Name: "Kere",
  partner2Name: "Ann",
};

async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.");

  await MonthlyEntry.deleteMany({});
  await Deduction.deleteMany({});
  await AccountDistribution.deleteMany({});
  await LineOfCredit.deleteMany({});
  await Settings.deleteMany({});
  console.log("🧹 Cleared existing data.");

  const entriesOnly = monthlyEntries.map(({ deductions: _d, ...rest }) => rest);
  await MonthlyEntry.insertMany(entriesOnly);
  console.log(`📅 Inserted ${entriesOnly.length} monthly entries.`);

  const flatDeductions = monthlyEntries.flatMap((row) =>
    row.deductions.map((d) => ({
      year: row.year,
      month: row.month,
      amount: d.amount,
      description: d.description,
    })),
  );
  /** Year-level / large line items stored as their own deduction rows (e.g. December 2024). */
  flatDeductions.push({
    year: 2024,
    month: "December",
    amount: 12152.87,
    description: "2024 consolidated expense",
  });

  if (flatDeductions.length > 0) {
    await Deduction.insertMany(flatDeductions);
    console.log(`📎 Inserted ${flatDeductions.length} deductions.`);
  }

  await AccountDistribution.insertMany(accountDistributions);
  console.log(`🏦 Inserted ${accountDistributions.length} account distributions.`);
  console.log(
    "   (Bank is not auto-adjusted here — live app updates Bank when entries/deductions are saved via API.)",
  );

  await LineOfCredit.insertMany(linesOfCredit);
  console.log(`💳 Inserted ${linesOfCredit.length} lines of credit.`);

  await Settings.create(settings);
  console.log("⚙️  Inserted settings.");

  console.log("\n✅ Seed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
