import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/constants";
import { formatDateShort } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { RecentTransaction } from "@/lib/actions/dashboard";

type RecentTransactionsProps = {
  transactions: RecentTransaction[];
  currency: string;
};

export function RecentTransactions({
  transactions,
  currency,
}: RecentTransactionsProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-5 ring-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-medium text-zinc-900 dark:text-zinc-100">
            Recent transactions
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Latest income and expenses
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/dashboard/income"
            className="text-emerald-400 hover:text-emerald-300"
          >
            All income →
          </Link>
          <Link
            href="/dashboard/expenses"
            className="text-rose-400 hover:text-rose-300"
          >
            All expenses →
          </Link>
        </div>
      </div>

      {transactions.length > 0 ? (
        <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-900">
          {transactions.map((tx) => (
            <li
              key={`${tx.kind}-${tx.id}`}
              className="flex items-center gap-3 py-3"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1",
                  tx.kind === "income"
                    ? "bg-emerald-500/10 ring-emerald-500/30"
                    : "bg-rose-500/10 ring-rose-500/30",
                )}
                aria-hidden
              >
                {tx.kind === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-rose-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-900 dark:text-zinc-100">
                  {tx.description ?? (tx.kind === "income" ? "Income" : "Expense")}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {tx.meta} · {formatDateShort(tx.date)}
                  {tx.kind === "income" && tx.status === "pending" ? (
                    <span className="ml-1 text-amber-400">· pending</span>
                  ) : null}
                </p>
              </div>
              <div
                className={cn(
                  "shrink-0 text-sm font-medium tabular-nums",
                  tx.kind === "income"
                    ? tx.status === "pending"
                      ? "text-amber-400"
                      : "text-emerald-300"
                    : "text-rose-300",
                )}
              >
                {tx.kind === "income" ? "+" : "-"}
                {formatCurrency(tx.amount, currency)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-800">
            <Receipt className="h-4 w-4 text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">No transactions yet</p>
          <p className="max-w-xs text-xs text-zinc-500">
            Start by adding your first income or expense.
          </p>
        </div>
      )}
    </Card>
  );
}
