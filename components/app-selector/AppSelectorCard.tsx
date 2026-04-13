import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  className?: string;
};

export function AppSelectorCard({
  href,
  title,
  description,
  statLabel,
  statValue,
  className,
}: Props) {
  return (
    <Link href={href} className={cn("group block focus-visible:outline-none", className)}>
      <Card className="h-full transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            {title}
            <ArrowRight
              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{statLabel}</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {statValue}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
