import { TrendingDown, Shuffle, AlertTriangle } from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

const PAIN_POINTS = [
  {
    icon: TrendingDown,
    title: "Irregular income makes budgeting impossible",
    description:
      "One month you bill $8K, the next $1.2K. Generic budget apps assume a paycheck — they don't.",
  },
  {
    icon: Shuffle,
    title: "Business and personal expenses blur together",
    description:
      "Was that Notion subscription work or personal? Your software stack and your life are tangled.",
  },
  {
    icon: AlertTriangle,
    title: "Tax season is always a surprise",
    description:
      "You spent the money you owed the government. Now you're calculating reserves at 11pm on April 14.",
  },
];

export function Problem() {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-900 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Your finances shouldn't be this hard
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {PAIN_POINTS.map(({ icon: Icon, title, description }, i) => (
            <AnimateOnScroll key={title} delay={i * 100}>
              <div className="flex flex-col">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-800">
                  <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
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
