"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h2>
        <p className="text-sm text-zinc-500">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-xs text-zinc-500">Reference: {error.digest}</p>
        )}
      </div>
      <Button
        type="button"
        onClick={reset}
        className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      >
        <RefreshCw />
        Try again
      </Button>
    </div>
  );
}
