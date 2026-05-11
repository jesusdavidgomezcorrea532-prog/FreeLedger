import Link from "next/link";
import { cn } from "@/lib/utils";

type UsageMeterProps = {
  label: string;
  current: number;
  limit: number;
  className?: string;
};

export function UsageMeter({ label, current, limit, className }: UsageMeterProps) {
  if (!Number.isFinite(limit)) return null;

  const ratio = limit > 0 ? Math.min(current / limit, 1) : 0;
  const percent = Math.round(ratio * 100);
  const reached = current >= limit;

  const barTone = reached
    ? "bg-red-500"
    : ratio >= 0.8
      ? "bg-amber-500"
      : "bg-emerald-500";

  const textTone = reached
    ? "text-red-400"
    : ratio >= 0.8
      ? "text-amber-400"
      : "text-zinc-600 dark:text-zinc-400";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-900 dark:bg-zinc-950 sm:flex-row sm:items-center sm:gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 sm:flex-1">
        <span className={cn("text-xs", textTone)}>
          <span className="tabular-nums font-medium text-zinc-800 dark:text-zinc-200">
            {current}
          </span>
          <span className="text-zinc-500"> of {limit} </span>
          {label}
        </span>
        <Link
          href="/dashboard/upgrade"
          className="text-xs text-emerald-500 hover:text-emerald-400 hover:underline"
        >
          Upgrade
        </Link>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 sm:w-32"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(current, limit)}
      >
        <div
          className={cn("h-full transition-all", barTone)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
