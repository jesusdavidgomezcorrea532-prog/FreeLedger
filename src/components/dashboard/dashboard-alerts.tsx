import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/constants";
import type {
  DashboardSummary,
  IncomeByClientPoint,
} from "@/lib/actions/dashboard";

type DashboardAlertsProps = {
  summary: DashboardSummary;
  incomeByClient: IncomeByClientPoint[];
  currency: string;
};

const CONCENTRATION_THRESHOLD = 60;

export function DashboardAlerts({
  summary,
  incomeByClient,
  currency,
}: DashboardAlertsProps) {
  const topClient = incomeByClient[0];
  const concentrationAlert =
    topClient && topClient.percentage > CONCENTRATION_THRESHOLD ? topClient : null;
  const showPending = summary.pendingIncome > 0;

  if (!concentrationAlert && !showPending) return null;

  return (
    <div className="space-y-2">
      {showPending && (
        <Link
          href="/dashboard/income?status=pending"
          className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm transition hover:bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/5 dark:hover:bg-amber-500/10"
        >
          <span className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              You have{" "}
              <strong className="font-semibold">
                {formatCurrency(summary.pendingIncome, currency)}
              </strong>{" "}
              in pending payments this month.
            </span>
          </span>
          <span className="hidden text-xs text-amber-700/80 dark:text-amber-200/80 sm:inline">
            View →
          </span>
        </Link>
      )}
      {concentrationAlert && (
        <div className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/5 px-3 py-2 text-sm text-orange-700 dark:text-orange-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold">
              {Math.round(concentrationAlert.percentage)}%
            </strong>{" "}
            of your income comes from{" "}
            <strong className="font-semibold">{concentrationAlert.clientName}</strong>
            . Consider diversifying.
          </span>
        </div>
      )}
    </div>
  );
}
