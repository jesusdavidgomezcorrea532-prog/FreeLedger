import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your FreeLedger account.",
  alternates: { canonical: "/login" },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/dashboard";
  const errorParam = params.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Link href="/" aria-label="FreeLedger home">
            <Logo />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to your FreeLedger account.
          </p>
        </div>

        {errorParam && (
          <div className="mt-6 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            We couldn&apos;t sign you in. Please try again.
          </div>
        )}

        <div className="mt-8 space-y-4">
          <GoogleButton next={next} />

          <div className="relative">
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-950 px-3 text-xs uppercase tracking-wider text-zinc-500">
              or
            </span>
          </div>

          <LoginForm next={next} />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-zinc-600 underline-offset-4 hover:text-emerald-400 hover:underline dark:text-zinc-400"
          >
            Get started free
          </Link>
        </p>
      </div>
    </div>
  );
}
