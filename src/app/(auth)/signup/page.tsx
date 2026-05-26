import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Start tracking your real money in seconds.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <GoogleButton label="Sign up with Google" />

          <div className="relative">
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-950 px-3 text-xs uppercase tracking-wider text-zinc-500">
              or
            </span>
          </div>

          <SignupForm />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-zinc-600 underline-offset-4 hover:text-emerald-400 hover:underline dark:text-zinc-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
