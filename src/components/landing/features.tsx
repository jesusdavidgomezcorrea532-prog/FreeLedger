import { Wallet, Users, Calculator, FolderTree } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

const FEATURES = [
  {
    icon: Wallet,
    title: "Real Money Dashboard",
    description:
      "See what you actually keep after expenses and taxes. One number, updated in real-time.",
  },
  {
    icon: Users,
    title: "Income by Client",
    description:
      "Know exactly who pays you, how much, and how concentrated your revenue is.",
  },
  {
    icon: Calculator,
    title: "Smart Tax Reserve",
    description:
      "Automatically calculate how much to set aside for taxes. No more surprises.",
  },
  {
    icon: FolderTree,
    title: "Business vs Personal",
    description:
      "Tag expenses as business, personal, or mixed. Know your real deductions.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-zinc-200 dark:border-zinc-900 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            One dashboard.{" "}
            <span className="text-emerald-400">Your complete financial picture.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <AnimateOnScroll key={title} delay={i * 100}>
              <div className="group relative overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
