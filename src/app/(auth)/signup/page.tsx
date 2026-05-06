import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { WaitlistForm } from "@/components/landing/waitlist-form";

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
            We&rsquo;re not quite ready yet!
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            FreeLedger is in pre-launch. Join the waitlist to be the first to
            know when we open.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <WaitlistForm variant="section" />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-zinc-600 underline-offset-4 hover:text-emerald-400 hover:underline dark:text-zinc-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
