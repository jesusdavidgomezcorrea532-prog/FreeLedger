import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

type LegalShellProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalShell({ title, lastUpdated, children }: LegalShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="FreeLedger home">
            <Logo />
          </Link>
          <ThemeToggle size="sm" />
        </div>
      </header>

      <main className="flex-1 px-6 py-12 sm:py-16">
        <article className="mx-auto max-w-3xl">
          <header className="border-b border-zinc-200 pb-6 dark:border-zinc-900">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Last updated: {lastUpdated}
            </p>
          </header>

          <div className="legal-prose mt-8 space-y-6 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {children}
          </div>
        </article>
      </main>

      <footer className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-900">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
          <p>&copy; 2026 FreeLedger. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-emerald-400"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-emerald-400"
            >
              Terms
            </Link>
            <Link href="/" className="transition-colors hover:text-emerald-400">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}
