import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <AnimateOnScroll className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Ready to know your real money?
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Join thousands of freelancers who finally understand their finances.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-emerald-500 px-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Free plan. No credit card. Setup in 2 minutes.
        </p>
      </AnimateOnScroll>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
