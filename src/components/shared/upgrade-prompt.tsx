"use client";

import Link from "next/link";
import { Check, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type UpgradePromptKind = "clients" | "transactions";

const COPY: Record<UpgradePromptKind, { subtitle: string }> = {
  clients: {
    subtitle: "Upgrade to Pro for unlimited clients",
  },
  transactions: {
    subtitle: "Upgrade to Pro for unlimited transactions",
  },
};

const FEATURES: readonly string[] = [
  "Unlimited clients",
  "Unlimited transactions",
  "CSV export",
  "Email reports (coming soon)",
];

type UpgradePromptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: UpgradePromptKind;
};

export function UpgradePrompt({ open, onOpenChange, kind }: UpgradePromptProps) {
  const { subtitle } = COPY[kind];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-emerald-500/30 bg-white dark:bg-zinc-950 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <DialogTitle className="text-zinc-900 dark:text-zinc-100">
              You&apos;ve hit your Free plan limit
            </DialogTitle>
          </div>
          <DialogDescription className="pt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 py-2">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <Check className="h-4 w-4 text-emerald-400" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-600 dark:text-zinc-400"
          >
            <X className="mr-1 h-4 w-4" /> Maybe later
          </Button>
          <Link
            href="/api/checkout?plan=pro_monthly"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-500 px-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Upgrade to Pro — $9/mo
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
