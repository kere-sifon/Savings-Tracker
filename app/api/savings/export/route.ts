import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";
import { Deduction } from "@/lib/models/savings/Deduction";
import { LineOfCredit } from "@/lib/models/savings/LineOfCredit";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { getOrCreateSettings } from "@/lib/models/savings/Settings";
import { compareYearMonth } from "@/lib/months";

export const dynamic = "force-dynamic";

function iso(d: unknown): string {
  if (!d) return "";
  return new Date(d as string | Date).toISOString();
}

type SheetCell = string | number | boolean | null | undefined;

function appendSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  headers: string[],
  rows: Record<string, SheetCell>[],
) {
  const sheet = workbook.addWorksheet(name);
  sheet.addRow(headers);
  for (const row of rows) {
    sheet.addRow(headers.map((header) => row[header] ?? ""));
  }
}

export async function GET() {
  try {
    await connectDB();
    const [entriesRaw, deductionsRaw, accountsRaw, locsRaw, settingsDoc] =
      await Promise.all([
        MonthlyEntry.find().lean(),
        Deduction.find().lean(),
        AccountDistribution.find().sort({ label: 1 }).lean(),
        LineOfCredit.find().sort({ name: 1 }).lean(),
        getOrCreateSettings(),
      ]);

    const entries = [...entriesRaw].sort((a, b) => compareYearMonth(a, b));
    const deductions = [...deductionsRaw].sort((a, b) =>
      compareYearMonth(a, b),
    );

    const workbook = new ExcelJS.Workbook();

    const monthlyRows = entries.map((e) => ({
      Year: e.year,
      Month: e.month,
      Kere: e.kere,
      Ann: e.ann,
      Note: e.note ?? "",
      "Updated (UTC)": iso(e.updatedAt),
    }));
    appendSheet(
      workbook,
      "Monthly entries",
      ["Year", "Month", "Kere", "Ann", "Note", "Updated (UTC)"],
      monthlyRows,
    );

    const dedRows = deductions.map((d) => ({
      Year: d.year,
      Month: d.month,
      Amount: d.amount,
      Description: d.description,
      "Updated (UTC)": iso(d.updatedAt),
    }));
    appendSheet(
      workbook,
      "Deductions",
      ["Year", "Month", "Amount", "Description", "Updated (UTC)"],
      dedRows,
    );

    const accRows = accountsRaw.map((a) => ({
      Label: a.label,
      Amount: a.amount,
      "Updated (UTC)": iso(a.updatedAt),
    }));
    appendSheet(
      workbook,
      "Accounts",
      ["Label", "Amount", "Updated (UTC)"],
      accRows,
    );

    const locRows = locsRaw.map((l) => ({
      Name: l.name,
      Balance: l.balance,
      "Updated (UTC)": iso(l.updatedAt),
    }));
    appendSheet(
      workbook,
      "Lines of credit",
      ["Name", "Balance", "Updated (UTC)"],
      locRows,
    );

    const s = settingsDoc.toObject();
    appendSheet(
      workbook,
      "Settings",
      ["Starting balance", "Partner 1 name", "Partner 2 name"],
      [
        {
          "Starting balance": s.startingBalance,
          "Partner 1 name": s.partner1Name,
          "Partner 2 name": s.partner2Name,
        },
      ],
    );

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const buf = Buffer.from(arrayBuffer);
    const filename = `savings-tracker-export-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to build export" },
      { status: 500 },
    );
  }
}
