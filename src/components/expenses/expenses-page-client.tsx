"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil, Plus, Search, Trash2, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthPicker } from "@/components/dashboard/month-picker";
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog";
import { DeleteConfirmDialog } from "@/components/clients/delete-confirm-dialog";
import { UsageMeter } from "@/components/shared/usage-meter";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { deleteExpenseAction } from "@/lib/actions/expenses";
import { EXPENSE_CATEGORIES, formatCurrency, getCategoryLabel } from "@/lib/constants";
import { formatDateShort } from "@/lib/dates";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/lib/plans";
import type { ExpenseCategory, ExpenseRecord, ExpenseType } from "@/types";

type Mode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; expense: ExpenseRecord }
  | { kind: "delete"; expense: ExpenseRecord };

type SortColumn = "date" | "amount" | "category";
type SortDir = "asc" | "desc";
type TypeFilter = "all" | ExpenseType;

type ExpensesPageClientProps = {
  expenses: ExpenseRecord[];
  year: number;
  month: number;
  monthLabel: string;
  currency: string;
  initialCategory: string | null;
  initialType: TypeFilter;
  initialSearch: string;
  initialSort: SortColumn;
  initialDir: SortDir;
  initialAction: string | null;
  plan: PlanType;
  transactionsThisMonth: number;
  transactionLimit: number;
};

const TYPE_BADGE: Record<ExpenseType, string> = {
  business: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
  personal: "bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/30",
  mixed: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30",
};

export function ExpensesPageClient({
  expenses,
  year,
  month,
  monthLabel,
  currency,
  initialCategory,
  initialType,
  initialSearch,
  initialSort,
  initialDir,
  initialAction,
  plan,
  transactionsThisMonth,
  transactionLimit,
}: ExpensesPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFree = plan === "free";
  const showMeter = isFree && Number.isFinite(transactionLimit);
  const limitReached = isFree && transactionsThisMonth >= transactionLimit;

  const [mode, setMode] = useState<Mode>(
    initialAction === "new" && !limitReached
      ? { kind: "create" }
      : { kind: "closed" },
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const close = () => setMode({ kind: "closed" });

  const handleAdd = () => {
    if (limitReached) {
      setShowPaywall(true);
      return;
    }
    setMode({ kind: "create" });
  };

  const prevTransactionsRef = useRef<number>(transactionsThisMonth);
  useEffect(() => {
    const prev = prevTransactionsRef.current;
    if (
      isFree &&
      Number.isFinite(transactionLimit) &&
      transactionsThisMonth > prev &&
      transactionsThisMonth >= Math.ceil(transactionLimit * 0.8) &&
      transactionsThisMonth < transactionLimit &&
      prev < Math.ceil(transactionLimit * 0.8)
    ) {
      toast.warning(
        `You've used ${transactionsThisMonth} of ${transactionLimit} transactions this month. Consider upgrading to Pro.`,
      );
    }
    prevTransactionsRef.current = transactionsThisMonth;
  }, [transactionsThisMonth, isFree, transactionLimit]);

  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory ?? "all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(initialType);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 300);
  const [sort, setSort] = useState<SortColumn>(initialSort);
  const [dir, setDir] = useState<SortDir>(initialDir);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const setOrDelete = (key: string, value: string, defaultValue: string) => {
      if (value && value !== defaultValue) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete("category", categoryFilter, "all");
    setOrDelete("type", typeFilter, "all");
    setOrDelete("search", debouncedSearch.trim(), "");
    setOrDelete("sort", sort, "date");
    setOrDelete("dir", dir, "desc");
    params.delete("action");

    const nextQuery = params.toString();
    const currentQuery = searchParams?.toString() ?? "";
    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [categoryFilter, typeFilter, debouncedSearch, sort, dir, pathname, router, searchParams]);

  const { total, deductible } = useMemo(() => {
    let total = 0;
    let deductible = 0;
    for (const e of expenses) {
      const amount = Number(e.amount);
      total += amount;
      deductible += amount * (e.deductible_pct / 100);
    }
    return { total, deductible };
  }, [expenses]);

  const availableCategories = useMemo(() => {
    const set = new Set<ExpenseCategory>();
    for (const e of expenses) set.add(e.category);
    return EXPENSE_CATEGORIES.filter((c) => set.has(c.value));
  }, [expenses]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return expenses.filter((e) => {
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (typeFilter !== "all" && e.expense_type !== typeFilter) return false;
      if (term) {
        const desc = e.description.toLowerCase();
        if (!desc.includes(term)) return false;
      }
      return true;
    });
  }, [expenses, categoryFilter, typeFilter, debouncedSearch]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const factor = dir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let cmp = 0;
      if (sort === "date") {
        cmp = a.date.localeCompare(b.date);
        if (cmp === 0) cmp = a.created_at.localeCompare(b.created_at);
      } else if (sort === "amount") {
        cmp = Number(a.amount) - Number(b.amount);
      } else {
        cmp = getCategoryLabel(a.category).localeCompare(getCategoryLabel(b.category));
      }
      return cmp * factor;
    });
    return arr;
  }, [filtered, sort, dir]);

  const toggleSort = (col: SortColumn) => {
    if (sort === col) {
      setDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(col);
      setDir(col === "date" || col === "amount" ? "desc" : "asc");
    }
  };

  const filtersActive =
    categoryFilter !== "all" ||
    typeFilter !== "all" ||
    debouncedSearch.trim().length > 0;

  const clearFilters = () => {
    setCategoryFilter("all");
    setTypeFilter("all");
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Expenses
          </h1>
          <p className="text-sm text-zinc-500">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker basePath="/dashboard/expenses" year={year} month={month} />
          <Button
            type="button"
            data-shortcut-new
            onClick={handleAdd}
            disabled={limitReached}
            title={limitReached ? "Limit reached — Upgrade to Pro" : undefined}
            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
          >
            <Plus className="mr-1 h-4 w-4" /> Add expense
          </Button>
        </div>
      </div>

      {showMeter && (
        <UsageMeter
          label="transactions this month"
          current={transactionsThisMonth}
          limit={transactionLimit}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <CardHeader>
            <CardDescription className="text-zinc-500">
              Total this month
            </CardDescription>
            <CardTitle className="text-2xl text-red-300">
              {formatCurrency(total, currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <CardHeader>
            <CardDescription className="text-zinc-500">
              Deductible portion
            </CardDescription>
            <CardTitle className="text-2xl text-emerald-400">
              {formatCurrency(deductible, currency)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {expenses.length === 0 ? (
        <EmptyState onAdd={handleAdd} disabled={limitReached} />
      ) : (
        <div className="space-y-3">
          <FilterBar
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            search={search}
            onSearchChange={setSearch}
            availableCategories={availableCategories}
          />
          {filtersActive && (
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                Showing {sorted.length} of {expenses.length}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            </div>
          )}

          {sorted.length === 0 ? (
            <NoMatchesState onClear={clearFilters} />
          ) : (
            <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-zinc-100 dark:bg-zinc-900/40 text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <SortableHeader
                        label="Date"
                        col="date"
                        sort={sort}
                        dir={dir}
                        onToggle={toggleSort}
                      />
                      <th className="px-4 py-2 text-left font-medium">Description</th>
                      <SortableHeader
                        label="Category"
                        col="category"
                        sort={sort}
                        dir={dir}
                        onToggle={toggleSort}
                      />
                      <th className="px-4 py-2 text-left font-medium">Type</th>
                      <SortableHeader
                        label="Amount"
                        col="amount"
                        sort={sort}
                        dir={dir}
                        onToggle={toggleSort}
                        align="right"
                      />
                      <th className="px-4 py-2 text-right font-medium" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
                    {sorted.map((e) => (
                      <tr key={e.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30">
                        <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                          {formatDateShort(e.date)}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-800 dark:text-zinc-200">
                          {e.description}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                          {getCategoryLabel(e.category)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                              TYPE_BADGE[e.expense_type],
                            )}
                          >
                            {e.expense_type === "mixed"
                              ? `Mixed · ${e.deductible_pct}%`
                              : e.expense_type === "business"
                                ? "Business"
                                : "Personal"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(Number(e.amount), currency)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit expense"
                              onClick={() => setMode({ kind: "edit", expense: e })}
                              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                              <Pencil />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete expense"
                              onClick={() => setMode({ kind: "delete", expense: e })}
                              className="text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <ExpenseFormDialog
        open={mode.kind === "create" || mode.kind === "edit"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        expense={mode.kind === "edit" ? mode.expense : null}
        key={mode.kind === "edit" ? mode.expense.id : mode.kind}
      />

      <DeleteConfirmDialog
        open={mode.kind === "delete"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Delete expense?"
        description="This will permanently remove this expense entry."
        onConfirm={async () => {
          if (mode.kind !== "delete") return { success: false, error: "Invalid state" };
          return deleteExpenseAction(mode.expense.id);
        }}
      />

      <UpgradePrompt
        open={showPaywall}
        onOpenChange={setShowPaywall}
        kind="transactions"
      />
    </div>
  );
}

type SortableHeaderProps = {
  label: string;
  col: SortColumn;
  sort: SortColumn;
  dir: SortDir;
  onToggle: (col: SortColumn) => void;
  align?: "left" | "right";
};

function SortableHeader({ label, col, sort, dir, onToggle, align = "left" }: SortableHeaderProps) {
  const active = sort === col;
  return (
    <th className={cn("px-4 py-2 font-medium", align === "right" ? "text-right" : "text-left")}>
      <button
        type="button"
        onClick={() => onToggle(col)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wider hover:text-zinc-800 dark:hover:text-zinc-200",
          active ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500",
          align === "right" && "ml-auto",
        )}
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <span className="h-3 w-3 opacity-0">·</span>
        )}
      </button>
    </th>
  );
}

type FilterBarProps = {
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  typeFilter: TypeFilter;
  onTypeChange: (v: TypeFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
  availableCategories: typeof EXPENSE_CATEGORIES;
};

function FilterBar({
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  search,
  onSearchChange,
  availableCategories,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <Input
          type="search"
          placeholder="Search description…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          data-search-input
          className="h-8 border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/40 pl-8 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      <Select
        value={categoryFilter}
        onValueChange={(v) => v != null && onCategoryChange(v)}
      >
        <SelectTrigger
          aria-label="Category filter"
          className="h-8 w-full sm:w-44"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {availableCategories.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/40 p-0.5 text-xs">
        {(["all", "business", "personal", "mixed"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onTypeChange(value)}
            className={cn(
              "rounded px-2.5 py-1 capitalize transition",
              typeFilter === value
                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
            )}
          >
            {value === "all" ? "All" : value}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  onAdd,
  disabled = false,
}: {
  onAdd: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-800">
        <TrendingDown className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        No expenses recorded this month
      </h2>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        {disabled
          ? "You've reached this month's transaction limit."
          : "Track every cost so you know what is actually deductible."}
      </p>
      <Button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        title={disabled ? "Limit reached — Upgrade to Pro" : undefined}
        className="mt-5 bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      >
        <Plus className="mr-1 h-4 w-4" /> Add expense
      </Button>
    </div>
  );
}

function NoMatchesState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 px-6 py-12 text-center">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">No expenses match your filters.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 text-xs text-emerald-400 hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}
