import { Check, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpgradeCtaButton } from "@/components/upgrade/upgrade-cta-button";
import { getCurrentUserUsage } from "@/lib/actions/limits";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/lib/plans";

export const metadata = {
  title: "Upgrade",
};

type Tier = {
  id: PlanType;
  name: string;
  priceLine: string;
  subline?: string;
  features: readonly string[];
  badge?: string;
  highlight?: boolean;
  ctaLabel: string;
  ctaVariant: "muted" | "primary" | "outline";
  checkoutPlan?: "pro_monthly" | "lifetime";
};

const TIERS: readonly Tier[] = [
  {
    id: "free",
    name: "Free",
    priceLine: "$0",
    subline: "forever",
    features: ["3 clients", "30 transactions/month", "Basic dashboard"],
    ctaLabel: "Current plan",
    ctaVariant: "muted",
  },
  {
    id: "pro",
    name: "Pro",
    priceLine: "$9/month",
    subline: "or $79/year (save 27%)",
    features: [
      "Unlimited clients",
      "Unlimited transactions",
      "CSV export",
      "Advanced filters",
      "Email reports (coming soon)",
    ],
    badge: "Most popular",
    highlight: true,
    ctaLabel: "Upgrade to Pro — $9/mo",
    ctaVariant: "primary",
    checkoutPlan: "pro_monthly",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    priceLine: "$69",
    subline: "one-time · only first 200 customers",
    features: ["Everything in Pro, forever", "No recurring billing"],
    ctaLabel: "Get Lifetime $69",
    ctaVariant: "outline",
    checkoutPlan: "lifetime",
  },
];

export default async function UpgradePage() {
  const usage = await getCurrentUserUsage();
  const currentPlan = usage?.plan ?? "free";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/30">
          <Sparkles className="h-3.5 w-3.5" /> Upgrade
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Pick the plan that fits how you freelance
        </h1>
        <p className="mx-auto max-w-xl text-sm text-zinc-500">
          Free is enough to get the rhythm. Pro unlocks unlimited tracking and
          features built for serious freelancers.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const isCurrent = tier.id === currentPlan;
          return (
            <Card
              key={tier.id}
              className={cn(
                "relative flex flex-col overflow-visible border bg-white transition-shadow dark:bg-zinc-950",
                tier.highlight
                  ? "border-emerald-500/40 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30 hover:shadow-emerald-500/10"
                  : "border-zinc-200 dark:border-zinc-900 hover:shadow-md",
              )}
            >
              {tier.badge && !isCurrent && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-medium text-zinc-950">
                  {tier.badge}
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  Current plan
                </span>
              )}

              <CardHeader>
                <CardTitle className="text-zinc-900 dark:text-zinc-100">
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  <span className="block text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {tier.priceLine}
                  </span>
                  {tier.subline && (
                    <span className="block text-xs text-zinc-500">
                      {tier.subline}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-zinc-100 px-3 text-sm font-medium text-zinc-500 dark:bg-zinc-900"
                  >
                    Current plan
                  </button>
                ) : tier.ctaVariant === "primary" && tier.checkoutPlan ? (
                  <UpgradeCtaButton
                    label={tier.ctaLabel}
                    plan={tier.checkoutPlan}
                    className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                  />
                ) : tier.ctaVariant === "outline" && tier.checkoutPlan ? (
                  <UpgradeCtaButton
                    label={tier.ctaLabel}
                    plan={tier.checkoutPlan}
                    className="border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  />
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-zinc-100 px-3 text-sm font-medium text-zinc-500 dark:bg-zinc-900"
                  >
                    {tier.ctaLabel}
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Questions? Reply to any FreeLedger email — we read every message.
      </p>
    </div>
  );
}
