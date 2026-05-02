"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="w-full justify-start text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
