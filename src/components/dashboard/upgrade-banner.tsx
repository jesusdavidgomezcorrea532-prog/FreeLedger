"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

const STORAGE_KEY = "freeledger:upgrade-banner-dismissed-at";
const DISMISS_DAYS = 7;

export function UpgradeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const dismissedAt = raw ? Number(raw) : 0;
    const now = Date.now();
    const expiry = DISMISS_DAYS * 24 * 60 * 60 * 1000;
    if (!dismissedAt || now - dismissedAt > expiry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm">
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <span>
          You&apos;re on the Free plan. Upgrade to Pro for unlimited tracking.{" "}
          <Link
            href="/dashboard/upgrade"
            className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline"
          >
            Upgrade →
          </Link>
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
          }
          setVisible(false);
        }}
        aria-label="Dismiss"
        className="rounded p-1 text-zinc-500 hover:bg-emerald-500/10 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
