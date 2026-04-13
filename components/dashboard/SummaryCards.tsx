import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";
import type { SummaryPayload } from "@/lib/summary";

type Props = {
  summary: SummaryPayload;
  partner1Name: string;
  partner2Name: string;
  /** Sum of Bank + FSHA distribution buckets (liquid / accessible). */
  bankAndFshaTotal: number;
};

export function SummaryCards({
  summary,
  partner1Name,
  partner2Name,
  bankAndFshaTotal,
}: Props) {
  const items: Array<{
    title: string;
    description: string;
    value: number;
    tone?: "positive" | "negative";
    footnote?: string;
  }> = [
    {
      title: "Total savings (YTD net)",
      description: `${partner1Name} + ${partner2Name} contributions minus deductions this year`,
      value: summary.totalSavings,
    },
    {
      title: "Total contributions YTD",
      description: "Combined partner contributions this calendar year",
      value: summary.totalContributionsYtd,
      tone: "positive",
    },
    {
      title: "Total deductions YTD",
      description: "All deductions this calendar year",
      value: summary.totalDeductionsYtd,
      tone: "negative",
    },
    {
      title: "Bank + FSHA",
      description:
        "Combined balance for liquid / accessible buckets (excludes GIC and GIC Return). Same subtotal as on Accounts.",
      value: bankAndFshaTotal,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-semibold tabular-nums ${
                item.tone === "positive"
                  ? "text-emerald-700"
                  : item.tone === "negative"
                    ? "text-red-600"
                    : "text-foreground"
              }`}
            >
              {formatCAD(item.value)}
            </p>
            {item.footnote ? (
              <p className="mt-2 text-xs text-muted-foreground">{item.footnote}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
