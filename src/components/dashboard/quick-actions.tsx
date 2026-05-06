import Link from "next/link";
import { Plus } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/dashboard/income?action=new"
        className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-500 px-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
      >
        <Plus className="h-3.5 w-3.5" /> Add income
      </Link>
      <Link
        href="/dashboard/expenses?action=new"
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        <Plus className="h-3.5 w-3.5" /> Add expense
      </Link>
    </div>
  );
}
