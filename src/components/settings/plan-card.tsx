import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS, type PlanType } from "@/lib/plans";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  plan: PlanType;
  clients: number;
  transactionsThisMonth: number;
};

const BADGE_TONE: Record<PlanType, string> = {
  free: "bg-zinc-200 text-zinc-700 ring-1 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
  pro: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
  lifetime: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
};

function PlanProgressRow({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}) {
  const finite = Number.isFinite(limit);
  const ratio = finite && limit > 0 ? Math.min(current / limit, 1) : 0;
  const reached = finite && current >= limit;
  const tone = !finite
    ? "bg-emerald-500"
    : reached
      ? "bg-red-500"
      : ratio >= 0.8
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="tabular-nums text-zinc-800 dark:text-zinc-200">
          {current}
          {finite ? ` / ${limit}` : " / unlimited"}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={cn("h-full transition-all", tone)}
          style={{ width: finite ? `${ratio * 100}%` : "100%" }}
        />
      </div>
    </div>
  );
}

export function PlanCard({
  plan,
  clients,
  transactionsThisMonth,
}: PlanCardProps) {
  const planConfig = PLANS[plan];
  const isFree = plan === "free";

  return (
    <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Your plan</CardTitle>
            <CardDescription>Usage this month and current tier.</CardDescription>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs",
              BADGE_TONE[plan],
            )}
          >
            {planConfig.name}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <PlanProgressRow
          label="Clients"
          current={clients}
          limit={planConfig.maxClients}
        />
        <PlanProgressRow
          label="Transactions this month"
          current={transactionsThisMonth}
          limit={planConfig.maxTransactionsPerMonth}
        />
        {isFree && (
          <Link
            href="/dashboard/upgrade"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-500 px-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Upgrade to Pro
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
