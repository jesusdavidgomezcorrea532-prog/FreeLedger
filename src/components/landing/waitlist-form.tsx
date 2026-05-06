"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist, type WaitlistState } from "@/lib/actions/waitlist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: WaitlistState = { success: true };

function SubmitButton({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { pending } = useFormStatus();

  if (variant === "compact") {
    return (
      <Button
        type="submit"
        disabled={pending}
        size="icon"
        className="h-11 w-11 shrink-0 bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
        aria-label="Join the waitlist"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 bg-emerald-500 px-6 font-medium text-zinc-950 hover:bg-emerald-400"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Joining...
        </>
      ) : (
        "Join the waitlist"
      )}
    </Button>
  );
}

type WaitlistFormProps = {
  variant?: "hero" | "section";
};

export function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  useEffect(() => {
    if (!state.timestamp) return;
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (!state.success) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className={
        variant === "hero"
          ? "flex w-full max-w-md flex-col gap-2 sm:flex-row"
          : "flex w-full max-w-lg flex-col gap-3 sm:flex-row"
      }
      noValidate
    >
      <Input
        type="email"
        name="email"
        required
        placeholder="you@freelance.com"
        autoComplete="email"
        className="h-11 flex-1 border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
      />
      <SubmitButton variant={variant === "hero" ? "default" : "default"} />
    </form>
  );
}
