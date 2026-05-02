"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signUpWithPassword, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: AuthState = { success: true };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full bg-emerald-500 font-medium text-zinc-950 hover:bg-emerald-400"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Create account"
      )}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signUpWithPassword, initialState);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!state.timestamp) return;
    if (!state.success) {
      toast.error(state.error);
    }
  }, [state]);

  if (state.success && state.message && state.timestamp) {
    return (
      <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
        <h2 className="mt-4 text-lg font-semibold text-zinc-100">
          Confirm your email
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          We sent a confirmation link to{" "}
          {submittedEmail ? (
            <span className="font-medium text-zinc-200">{submittedEmail}</span>
          ) : (
            "your email"
          )}
          . Click the link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        setSubmittedEmail(String(formData.get("email") ?? "") || null);
        formAction(formData);
      }}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-300">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Jane Doe"
          className="h-11 border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@freelance.com"
          className="h-11 border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="h-11 border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-zinc-300">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repeat your password"
          className="h-11 border-zinc-800 bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
