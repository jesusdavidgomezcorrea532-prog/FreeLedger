import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import { Logo } from "@/components/shared/logo";

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 px-6 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
      </div>
    </header>
  );
}

function WaitlistCTA() {
  return (
    <section className="px-6 py-24">
      <AnimateOnScroll className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          Be the first to try FreeLedger
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          We're launching soon. Join the waitlist and get early access.
        </p>

        <div className="mt-10 flex justify-center">
          <WaitlistForm variant="section" />
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Free plan available at launch. No credit card required.
        </p>
      </AnimateOnScroll>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
