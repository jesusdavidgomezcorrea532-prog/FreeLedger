"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type UpgradeCtaButtonProps = {
  label: string;
  plan: "pro_monthly" | "lifetime";
  className?: string;
};

export function UpgradeCtaButton({
  label,
  plan,
  className,
}: UpgradeCtaButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [hasRedirected, setHasRedirected] = useState(false);

  const handleClick = () => {
    startTransition(() => {
      setHasRedirected(true);
      try {
        window.location.href = `/api/checkout?plan=${plan}`;
      } catch {
        setHasRedirected(false);
        toast.error("Could not start checkout. Please try again.");
      }
    });
  };

  const busy = isPending || hasRedirected;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={cn(
        "inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {busy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Redirecting…
        </>
      ) : (
        label
      )}
    </button>
  );
}
