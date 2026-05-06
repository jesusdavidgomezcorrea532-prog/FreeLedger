import Link from "next/link";
import {
  ArrowRight,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type EmptyDashboardProps = {
  displayName: string;
};

const ACTIONS = [
  {
    href: "/dashboard/clients",
    icon: Users,
    title: "Add your first client",
    description: "Track who pays you and tag every income.",
    accent: "text-blue-300",
    ring: "ring-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    href: "/dashboard/income",
    icon: TrendingUp,
    title: "Record income",
    description: "Log a payment to start seeing real money.",
    accent: "text-emerald-300",
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  {
    href: "/dashboard/expenses",
    icon: Receipt,
    title: "Track an expense",
    description: "Capture a deductible to reduce your tax reserve.",
    accent: "text-rose-300",
    ring: "ring-rose-500/30",
    bg: "bg-rose-500/10",
  },
] as const;

export function EmptyDashboard({ displayName }: EmptyDashboardProps) {
  const firstName = displayName.split(/\s+/)[0] || displayName;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 px-6 py-10 text-center sm:px-12 sm:py-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <Wallet className="h-8 w-8 text-emerald-300" aria-hidden />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Welcome to FreeLedger, {firstName}!
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
          Let&apos;s set up your financial dashboard. Start by adding a client and
          recording your first income — your real money will appear here as you
          go.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group">
              <Card className="h-full border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-5 ring-0 transition-colors group-hover:border-zinc-800 group-hover:bg-zinc-900/50">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${action.bg} ${action.ring}`}
                >
                  <Icon className={`h-5 w-5 ${action.accent}`} aria-hidden />
                </div>
                <h3 className="mt-4 font-heading text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {action.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-hover:text-zinc-100">
                  Get started
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
