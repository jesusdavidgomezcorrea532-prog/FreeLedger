import dynamic from "next/dynamic";
import { Suspense } from "react";
import { MonthPicker } from "@/components/dashboard/month-picker";
import { DashboardAlerts } from "@/components/dashboard/dashboard-alerts";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ChartSkeleton } from "@/components/dashboard/skeletons";
import { UpgradeBanner } from "@/components/dashboard/upgrade-banner";
import { UpgradeSuccessToast } from "@/components/dashboard/upgrade-success-toast";

const MonthlyTrendChart = dynamic(
  () =>
    import("@/components/dashboard/monthly-trend-chart").then(
      (m) => m.MonthlyTrendChart,
    ),
  { loading: () => <ChartSkeleton /> },
);
const IncomeByClientChart = dynamic(
  () =>
    import("@/components/dashboard/income-by-client-chart").then(
      (m) => m.IncomeByClientChart,
    ),
  { loading: () => <ChartSkeleton /> },
);
const ExpensesByCategoryChart = dynamic(
  () =>
    import("@/components/dashboard/expenses-by-category-chart").then(
      (m) => m.ExpensesByCategoryChart,
    ),
  { loading: () => <ChartSkeleton /> },
);
import {
  getDashboardSummary,
  getExpensesByCategory,
  getIncomeByClient,
  getMonthlyTrend,
  getRecentTransactions,
} from "@/lib/actions/dashboard";
import { getClients } from "@/lib/actions/clients";
import { getCurrentUserUsage } from "@/lib/actions/limits";
import { getUserRecord } from "@/lib/actions/settings";
import { parseMonthParams } from "@/lib/dates";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const range = parseMonthParams(sp);

  const [
    summary,
    incomeByClient,
    monthlyTrend,
    expensesByCategory,
    recentTransactions,
    userRecord,
    clients,
    usage,
  ] = await Promise.all([
    getDashboardSummary(range.year, range.month),
    getIncomeByClient(range.year, range.month),
    getMonthlyTrend(6),
    getExpensesByCategory(range.year, range.month),
    getRecentTransactions(5),
    getUserRecord(),
    getClients(),
    getCurrentUserUsage(),
  ]);

  const isFree = (usage?.plan ?? "free") === "free";

  const currency = userRecord?.currency ?? "USD";
  const taxRate = userRecord?.tax_rate ?? 0;
  const displayName =
    userRecord?.display_name ?? userRecord?.email?.split("@")[0] ?? "there";

  const hasAnyData =
    clients.length > 0 ||
    summary.totalIncome > 0 ||
    summary.pendingIncome > 0 ||
    summary.totalExpenses > 0 ||
    monthlyTrend.some(
      (m) => m.income > 0 || m.expenses > 0 || m.realMoney !== 0,
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={null}>
        <UpgradeSuccessToast />
      </Suspense>
      {!hasAnyData ? (
        <EmptyDashboard displayName={displayName} />
      ) : (
        <div className="space-y-6">
          {isFree && <UpgradeBanner />}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-500">{range.label}</p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <MonthPicker
                basePath="/dashboard"
                year={range.year}
                month={range.month}
              />
              <QuickActions />
            </div>
          </div>

          <DashboardAlerts
            summary={summary}
            incomeByClient={incomeByClient}
            currency={currency}
          />

          <SummaryCards
            summary={summary}
            trend={monthlyTrend}
            currency={currency}
            taxRate={taxRate}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <MonthlyTrendChart data={monthlyTrend} currency={currency} />
            <IncomeByClientChart data={incomeByClient} currency={currency} />
          </div>

          <ExpensesByCategoryChart
            data={expensesByCategory}
            currency={currency}
          />

          <RecentTransactions
            transactions={recentTransactions}
            currency={currency}
          />
        </div>
      )}
    </div>
  );
}
