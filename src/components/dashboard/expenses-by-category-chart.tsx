"use client";

import { Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency, getCurrencySymbol } from "@/lib/constants";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import type { ExpensesByCategoryPoint } from "@/lib/actions/dashboard";

type ExpensesByCategoryChartProps = {
  data: ExpensesByCategoryPoint[];
  currency: string;
};

export function ExpensesByCategoryChart({
  data,
  currency,
}: ExpensesByCategoryChartProps) {
  const theme = useChartTheme();
  const hasData = data.length > 0 && data[0].total > 0;
  const max = data.reduce((m, p) => Math.max(m, p.total), 0);
  const chartHeight = Math.max(180, data.length * 36 + 24);

  return (
    <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-5 ring-0">
      <div>
        <h3 className="font-heading text-base font-medium text-zinc-900 dark:text-zinc-100">
          Expenses by category
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">This month</p>
      </div>

      {hasData ? (
        <div
          className="mt-4 w-full"
          style={{ minHeight: chartHeight, height: chartHeight }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                stroke={theme.axis}
                tick={{ fill: theme.tick, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  `${getCurrencySymbol(currency)}${compactNumber(v)}`
                }
              />
              <YAxis
                type="category"
                dataKey="label"
                stroke={theme.axis}
                tick={{ fill: theme.tick, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip
                cursor={{ fill: theme.grid, fillOpacity: 0.4 }}
                contentStyle={{
                  backgroundColor: theme.tooltipBg,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.tooltipText,
                }}
                formatter={(value) => [
                  formatCurrency(Number(value) || 0, currency),
                  "Total",
                ]}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={18}>
                {data.map((point) => {
                  const ratio = max > 0 ? point.total / max : 0;
                  const opacity = 0.5 + ratio * 0.5;
                  return (
                    <Cell
                      key={point.category}
                      fill="#10b981"
                      fillOpacity={opacity}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-4 flex h-44 flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-800">
            <Wallet className="h-4 w-4 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">No expenses tracked</p>
          <p className="max-w-xs text-xs text-zinc-500">
            Record expenses to see your spending breakdown.
          </p>
        </div>
      )}
    </Card>
  );
}

function compactNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toFixed(0);
}
