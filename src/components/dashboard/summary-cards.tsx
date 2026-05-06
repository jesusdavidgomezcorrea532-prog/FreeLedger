"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type {
  DashboardSummary,
  MonthlyTrendPoint,
} from "@/lib/actions/dashboard";

type SummaryCardsProps = {
  summary: DashboardSummary;
  trend: MonthlyTrendPoint[];
  currency: string;
  taxRate: number;
};

export function SummaryCards({
  summary,
  trend,
  currency,
  taxRate,
}: SummaryCardsProps) {
  const last = trend[trend.length - 1]?.realMoney ?? summary.realMoney;
  const previous = trend[trend.length - 2]?.realMoney ?? 0;
  const delta = computeDelta(last, previous);
  const positive = summary.realMoney >= 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <RealMoneyCard
        amount={summary.realMoney}
        currency={currency}
        delta={delta}
        positive={positive}
        trend={trend}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
        <MetricCard
          label="Income"
          amount={summary.totalIncome}
          currency={currency}
          tone="emerald"
          subtext={
            summary.pendingIncome > 0
              ? `${formatCurrency(summary.pendingIncome, currency)} pending`
              : "All received"
          }
          subtextTone={summary.pendingIncome > 0 ? "amber" : "muted"}
        />
        <MetricCard
          label="Expenses"
          amount={summary.totalExpenses}
          currency={currency}
          tone="rose"
          subtext={
            summary.businessExpenses > 0
              ? `${formatCurrency(summary.businessExpenses, currency)} business`
              : "No business expenses"
          }
          subtextTone="muted"
        />
        <MetricCard
          label="Deductible"
          amount={summary.deductibleAmount}
          currency={currency}
          tone="blue"
          subtext={`of ${formatCurrency(summary.totalExpenses, currency)} total`}
          subtextTone="muted"
        />
        <MetricCard
          label="Tax reserve"
          amount={summary.taxReserve}
          currency={currency}
          tone="amber"
          subtext={`at ${taxRate}% rate`}
          subtextTone="muted"
        />
      </div>
    </div>
  );
}

type DeltaInfo = {
  kind: "up" | "down" | "flat" | "new";
  pct: number;
};

function computeDelta(current: number, previous: number): DeltaInfo {
  if (previous === 0) {
    if (current === 0) return { kind: "flat", pct: 0 };
    return { kind: "new", pct: 0 };
  }
  const change = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(change) < 0.05) return { kind: "flat", pct: 0 };
  return { kind: change > 0 ? "up" : "down", pct: Math.abs(change) };
}

function RealMoneyCard({
  amount,
  currency,
  delta,
  positive,
  trend,
}: {
  amount: number;
  currency: string;
  delta: DeltaInfo;
  positive: boolean;
  trend: MonthlyTrendPoint[];
}) {
  const max = Math.max(
    1,
    ...trend.map((p) => Math.max(Math.abs(p.realMoney), 0)),
  );

  return (
    <Card
      className={cn(
        "relative col-span-1 overflow-hidden border bg-gradient-to-br p-6 shadow-lg ring-0",
        positive
          ? "border-emerald-500/20 from-emerald-950/40 via-zinc-950 to-zinc-950"
          : "border-rose-500/20 from-rose-950/40 via-zinc-950 to-zinc-950",
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Your real money
        </p>
        <p
          className={cn(
            "font-heading text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl",
            positive ? "text-emerald-300" : "text-rose-300",
          )}
        >
          {formatCurrency(amount, currency)}
        </p>
      </div>

      <DeltaPill delta={delta} />

      <div className="mt-6">
        <div className="flex items-end gap-1.5">
          {trend.map((point, i) => {
            const value = point.realMoney;
            const heightPct = Math.max(
              4,
              Math.round((Math.abs(value) / max) * 100),
            );
            const isLast = i === trend.length - 1;
            return (
              <div
                key={`${point.year}-${point.monthIndex}`}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-16 w-full items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all",
                      value >= 0
                        ? isLast
                          ? "bg-emerald-400"
                          : "bg-emerald-500/40"
                        : isLast
                          ? "bg-rose-400"
                          : "bg-rose-500/40",
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
                  {point.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function DeltaPill({ delta }: { delta: DeltaInfo }) {
  if (delta.kind === "new") {
    return (
      <p className="mt-2 text-xs text-zinc-500">First tracked month</p>
    );
  }
  if (delta.kind === "flat") {
    return (
      <div className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500">
        <Minus className="h-3 w-3" />
        Same as last month
      </div>
    );
  }
  const Icon = delta.kind === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div
      className={cn(
        "mt-2 inline-flex items-center gap-1 text-xs font-medium",
        delta.kind === "up" ? "text-emerald-400" : "text-rose-400",
      )}
    >
      <Icon className="h-3 w-3" />
      {delta.kind === "up" ? "+" : "-"}
      {delta.pct.toFixed(1)}% vs last month
    </div>
  );
}

type Tone = "emerald" | "rose" | "blue" | "amber";
type SubtextTone = "amber" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  emerald: "text-emerald-300",
  rose: "text-rose-300",
  blue: "text-blue-300",
  amber: "text-amber-300",
};

const SUBTEXT_CLASSES: Record<SubtextTone, string> = {
  amber: "text-amber-400",
  muted: "text-zinc-500",
};

function MetricCard({
  label,
  amount,
  currency,
  tone,
  subtext,
  subtextTone,
}: {
  label: string;
  amount: number;
  currency: string;
  tone: Tone;
  subtext: string;
  subtextTone: SubtextTone;
}) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-5 ring-0">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-heading text-2xl font-semibold tabular-nums sm:text-3xl",
          TONE_CLASSES[tone],
        )}
      >
        {formatCurrency(amount, currency)}
      </p>
      <p className={cn("mt-1 text-xs", SUBTEXT_CLASSES[subtextTone])}>
        {subtext}
      </p>
    </Card>
  );
}
