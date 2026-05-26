import Link from "next/link";
import { Check } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: { label: string; href?: string; disabled?: boolean };
  highlighted?: boolean;
  badge?: string;
  note?: string;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get the basics for tracking a couple of clients.",
    features: [
      "Up to 3 clients",
      "30 transactions / month",
      "Basic dashboard",
      "Light & dark mode",
    ],
    cta: { label: "Get started free", href: "/signup" },
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "Everything you need to run your freelance finances.",
    features: [
      "Unlimited clients",
      "Unlimited transactions",
      "CSV export & advanced filters",
      "Tax reserve & smart alerts",
      "Monthly email reports",
    ],
    cta: { label: "Start Pro — $9/mo", href: "/signup" },
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "$69",
    period: "one-time",
    description: "Pay once. Use FreeLedger forever.",
    features: [
      "Everything in Pro",
      "All future updates included",
      "Founder access channel",
      "Limited to first 200 customers",
    ],
    cta: { label: "Get Lifetime — $69", href: "/signup" },
    note: "Only first 200",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-b border-zinc-200 dark:border-zinc-900 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Simple pricing.{" "}
            <span className="text-emerald-400">No surprises.</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Start free. Upgrade when you outgrow it.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <AnimateOnScroll key={plan.name} delay={i * 80}>
              <PricingCard plan={plan} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-colors sm:p-8",
        plan.highlighted
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-2xl shadow-emerald-500/5 ring-1 ring-emerald-500/30"
          : "border-zinc-300 bg-zinc-100 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700",
      )}
    >
      {plan.badge && (
        <div className="absolute right-6 top-6 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-400">
          {plan.badge}
        </div>
      )}

      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {plan.name}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {plan.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {plan.price}
        </span>
        {plan.period && (
          <span className="text-sm text-zinc-500">{plan.period}</span>
        )}
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        {plan.cta.disabled ? (
          <button
            type="button"
            disabled
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 bg-zinc-200/60 px-4 text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-500"
          >
            {plan.cta.label}
          </button>
        ) : (
          <Link
            href={plan.cta.href ?? "#"}
            className={cn(
              "inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors",
              plan.highlighted
                ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
            )}
          >
            {plan.cta.label}
          </Link>
        )}

        {plan.note && (
          <p className="mt-3 text-center text-xs text-zinc-500">{plan.note}</p>
        )}
      </div>
    </div>
  );
}
