"use client";

import { useActionState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction, type UserSettingsState } from "@/lib/actions/settings";

const INITIAL_STATE: UserSettingsState = { success: false, error: "" };

type ProfileFormProps = {
  displayName: string;
  email: string;
};

export function ProfileForm({ displayName, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (!state.timestamp) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={displayName}
          required
          className="border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          value={email}
          readOnly
          disabled
          className="border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400"
        />
        <p className="text-xs text-zinc-500">Contact support to change your email.</p>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      >
        {pending && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
        Save profile
      </Button>
    </form>
  );
}
