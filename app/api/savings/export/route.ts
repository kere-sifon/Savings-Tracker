import * as XLSX from "xlsx";
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

    const wb = XLSX.utils.book_new();

    const monthlyRows = entries.map((e) => ({
      Year: e.year,
      Month: e.month,
      Kere: e.kere,
      Ann: e.ann,
      Note: e.note ?? "",
      "Updated (UTC)": iso(e.updatedAt),
    }));
    XLSX.utils.book_append_sheet(
      wb,
      monthlyRows.length
        ? XLSX.utils.json_to_sheet(monthlyRows)
        : XLSX.utils.aoa_to_sheet([
            ["Year", "Month", "Kere", "Ann", "Note", "Updated (UTC)"],
          ]),
      "Monthly entries",
    );

    const dedRows = deductions.map((d) => ({
      Year: d.year,
      Month: d.month,
      Amount: d.amount,
      Description: d.description,
      "Updated (UTC)": iso(d.updatedAt),
    }));
    XLSX.utils.book_append_sheet(
      wb,
      dedRows.length
        ? XLSX.utils.json_to_sheet(dedRows)
        : XLSX.utils.aoa_to_sheet([
            ["Year", "Month", "Amount", "Description", "Updated (UTC)"],
          ]),
      "Deductions",
    );

    const accRows = accountsRaw.map((a) => ({
      Label: a.label,
      Amount: a.amount,
      "Updated (UTC)": iso(a.updatedAt),
    }));
    XLSX.utils.book_append_sheet(
      wb,
      accRows.length
        ? XLSX.utils.json_to_sheet(accRows)
        : XLSX.utils.aoa_to_sheet([["Label", "Amount", "Updated (UTC)"]]),
      "Accounts",
    );

    const locRows = locsRaw.map((l) => ({
      Name: l.name,
      Balance: l.balance,
      "Updated (UTC)": iso(l.updatedAt),
    }));
    XLSX.utils.book_append_sheet(
      wb,
      locRows.length
        ? XLSX.utils.json_to_sheet(locRows)
        : XLSX.utils.aoa_to_sheet([["Name", "Balance", "Updated (UTC)"]]),
      "Lines of credit",
    );

    const s = settingsDoc.toObject();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet([
        {
          "Starting balance": s.startingBalance,
          "Partner 1 name": s.partner1Name,
          "Partner 2 name": s.partner2Name,
        },
      ]),
      "Settings",
    );

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
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
