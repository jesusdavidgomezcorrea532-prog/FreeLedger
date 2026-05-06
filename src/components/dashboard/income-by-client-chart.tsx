"use client";

import { Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/constants";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import type { IncomeByClientPoint } from "@/lib/actions/dashboard";

type IncomeByClientChartProps = {
  data: IncomeByClientPoint[];
  currency: string;
};

export function IncomeByClientChart({
  data,
  currency,
}: IncomeByClientChartProps) {
  const theme = useChartTheme();
  const total = data.reduce((sum, p) => sum + p.total, 0);
  const hasData = total > 0;

  return (
    <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-5 ring-0">
      <div>
        <h3 className="font-heading text-base font-medium text-zinc-900 dark:text-zinc-100">
          Income by client
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">Received this month</p>
      </div>

      {hasData ? (
        <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_1fr]">
          <div className="relative w-full" style={{ minHeight: 224, height: 224 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.tooltipBg,
                    border: `1px solid ${theme.tooltipBorder}`,
                    borderRadius: 8,
                    fontSize: 12,
                    color: theme.tooltipText,
                  }}
                  formatter={(value, _name, entry) => [
                    formatCurrency(Number(value) || 0, currency),
                    (entry?.payload as IncomeByClientPoint | undefined)
                      ?.clientName ?? "",
                  ]}
                />
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="clientName"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={data.length > 1 ? 2 : 0}
                  stroke={theme.ringStroke}
                  strokeWidth={2}
                >
                  {data.map((point) => (
                    <Cell
                      key={point.clientId}
                      fill={point.clientColor}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                Total
              </span>
              <span className="font-heading text-base font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>

          <ul className="space-y-2">
            {data.map((point) => (
              <li
                key={point.clientId}
                className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: point.clientColor }}
                    aria-hidden
                  />
                  <span className="truncate text-sm text-zinc-800 dark:text-zinc-200">
                    {point.clientName}
                  </span>
                </div>
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-sm font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(point.total, currency)}
                  </span>
                  <span className="text-[10px] tabular-nums text-zinc-500">
                    {point.percentage.toFixed(1)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 flex h-56 flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-800">
            <Users className="h-4 w-4 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">No client income yet</p>
          <p className="max-w-xs text-xs text-zinc-500">
            Record income to see your client breakdown.
          </p>
        </div>
      )}
    </Card>
  );
}
