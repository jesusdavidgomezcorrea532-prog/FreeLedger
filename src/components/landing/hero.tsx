import { Sparkles } from "lucide-react";
import { WaitlistForm } from "./waitlist-form";

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -inset-x-8 -top-8 -bottom-8 bg-emerald-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-2xl shadow-emerald-500/5 backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-950/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="ml-3 text-xs text-zinc-500">freeledger.dev/dashboard</span>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4 sm:col-span-2">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">Real money</p>
              <span className="text-xs text-emerald-400">+12.4%</span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
              $8,420.50
            </p>
            <div className="mt-4 flex h-16 items-end gap-1">
              {[40, 65, 50, 80, 55, 90, 75, 95, 70, 100, 85, 110].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-emerald-500/40"
                  style={{ height: `${h * 0.6}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
              <p className="text-xs text-zinc-500">Tax reserve</p>
              <p className="mt-1 text-lg font-semibold text-zinc-100">$2,105</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
              <p className="text-xs text-zinc-500">This month</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">$3,200</p>
            </div>
          </div>

          <div className="sm:col-span-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Income by client
            </p>
            <div className="mt-3 space-y-2.5">
              {[
                { name: "Acme Corp", pct: 45, amount: "$3,800" },
                { name: "Studio K", pct: 30, amount: "$2,500" },
                { name: "Other", pct: 25, amount: "$2,120" },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm text-zinc-300">{c.name}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm tabular-nums text-zinc-400">
                    {c.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-900 px-6 pt-24 pb-20 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-300">
            <Sparkles className="h-3 w-3" />
            <span>Launching May 2026</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
            Know your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              real money.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            The finance dashboard built for freelancers. Track income by client,
            separate business from personal expenses, calculate your tax reserve, and
            finally answer:{" "}
            <span className="text-zinc-200">how much money do I actually have?</span>
          </p>

          <div className="mt-10 flex justify-center">
            <WaitlistForm variant="hero" />
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            Free plan available at launch. No credit card required.
          </p>
        </div>

        <div className="mt-20">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
