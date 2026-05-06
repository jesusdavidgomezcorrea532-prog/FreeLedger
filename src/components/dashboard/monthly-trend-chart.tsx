"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency, getCurrencySymbol } from "@/lib/constants";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import type { MonthlyTrendPoint } from "@/lib/actions/dashboard";

type MonthlyTrendChartProps = {
  data: MonthlyTrendPoint[];
  currency: string;
};

export function MonthlyTrendChart({ data, currency }: MonthlyTrendChartProps) {
  const theme = useChartTheme();
  const hasData = data.some(
    (p) => p.income !== 0 || p.expenses !== 0 || p.realMoney !== 0,
  );

  return (
    <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-5 ring-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-medium text-zinc-900 dark:text-zinc-100">
            Monthly trend
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Last {data.length} months
          </p>
        </div>
      </div>

      <div className="mt-4 w-full" style={{ minHeight: 288, height: 288 }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke={theme.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke={theme.axis}
                tick={{ fill: theme.tick, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={theme.axis}
                tick={{ fill: theme.tick, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v: number) =>
                  `${getCurrencySymbol(currency)}${compactNumber(v)}`
                }
              />
              <Tooltip
                cursor={{
                  stroke: theme.cursor,
                  strokeDasharray: "3 3",
                }}
                contentStyle={{
                  backgroundColor: theme.tooltipBg,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.tooltipText,
                }}
                labelStyle={{ color: theme.tooltipLabel, marginBottom: 4 }}
                formatter={(value, name) => [
                  formatCurrency(Number(value) || 0, currency),
                  String(name ?? ""),
                ]}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: theme.legend,
                  paddingTop: 8,
                }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f43f5e", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="realMoney"
                name="Real money"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </Card>
  );
}

function compactNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toFixed(0);
}

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-800">
        <TrendingUp className="h-4 w-4 text-zinc-500" />
      </div>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">Not enough data yet</p>
      <p className="max-w-xs text-xs text-zinc-500">
        Add income and expenses to see your trends.
      </p>
    </div>
  );
}
