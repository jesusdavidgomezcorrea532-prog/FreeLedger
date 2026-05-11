"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil, Plus, Search, Trash2, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthPicker } from "@/components/dashboard/month-picker";
import { IncomeFormDialog } from "@/components/income/income-form-dialog";
import { DeleteConfirmDialog } from "@/components/clients/delete-confirm-dialog";
import { UsageMeter } from "@/components/shared/usage-meter";
import { UpgradePrompt } from "@/components/shared/upgrade-prompt";
import { deleteIncomeAction } from "@/lib/actions/income";
import { formatCurrency, getPaymentMethodLabel } from "@/lib/constants";
import { formatDateShort } from "@/lib/dates";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/lib/plans";
import type { ClientRecord, IncomeWithClient } from "@/types";

type Mode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; income: IncomeWithClient }
  | { kind: "delete"; income: IncomeWithClient };

type SortColumn = "date" | "amount" | "client";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "received" | "pending";

type IncomePageClientProps = {
  income: IncomeWithClient[];
  clients: ClientRecord[];
  year: number;
  month: number;
  monthLabel: string;
  currency: string;
  initialClientId: string | null;
  initialStatus: StatusFilter;
  initialSearch: string;
  initialSort: SortColumn;
  initialDir: SortDir;
  initialAction: string | null;
  plan: PlanType;
  transactionsThisMonth: number;
  transactionLimit: number;
};

export function IncomePageClient({
  income,
  clients,
  year,
  month,
  monthLabel,
  currency,
  initialClientId,
  initialStatus,
  initialSearch,
  initialSort,
  initialDir,
  initialAction,
  plan,
  transactionsThisMonth,
  transactionLimit,
}: IncomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFree = plan === "free";
  const showMeter = isFree && Number.isFinite(transactionLimit);
  const limitReached = isFree && transactionsThisMonth >= transactionLimit;
  const noClients = clients.length === 0;

  const [mode, setMode] = useState<Mode>(
    initialAction === "new" && !noClients && !limitReached
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

  const addDisabled = noClients || limitReached;
  const addTitle = limitReached
    ? "Limit reached — Upgrade to Pro"
    : noClients
      ? "Add a client first"
      : undefined;

  const [clientFilter, setClientFilter] = useState<string>(initialClientId ?? "all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
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

    setOrDelete("client", clientFilter, "all");
    setOrDelete("status", statusFilter, "all");
    setOrDelete("search", debouncedSearch.trim(), "");
    setOrDelete("sort", sort, "date");
    setOrDelete("dir", dir, "desc");
    params.delete("action");

    const nextQuery = params.toString();
    const currentQuery = searchParams?.toString() ?? "";
    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [clientFilter, statusFilter, debouncedSearch, sort, dir, pathname, router, searchParams]);

  const { receivedTotal, pendingTotal } = useMemo(() => {
    let received = 0;
    let pending = 0;
    for (const i of income) {
      if (i.status === "received") received += Number(i.amount);
      else pending += Number(i.amount);
    }
    return { receivedTotal: received, pendingTotal: pending };
  }, [income]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return income.filter((i) => {
      if (clientFilter !== "all") {
        if (clientFilter === "unassigned") {
          if (i.client_id) return false;
        } else if (i.client_id !== clientFilter) {
          return false;
        }
      }
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (term) {
        const desc = (i.description ?? "").toLowerCase();
        const clientName = (i.client?.name ?? "").toLowerCase();
        if (!desc.includes(term) && !clientName.includes(term)) return false;
      }
      return true;
    });
  }, [income, clientFilter, statusFilter, debouncedSearch]);

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
        cmp = (a.client?.name ?? "").localeCompare(b.client?.name ?? "");
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

  const filteredCount = sorted.length;
  const totalCount = income.length;
  const filtersActive =
    clientFilter !== "all" ||
    statusFilter !== "all" ||
    debouncedSearch.trim().length > 0;

  const clearFilters = () => {
    setClientFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Income
          </h1>
          <p className="text-sm text-zinc-500">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker basePath="/dashboard/income" year={year} month={month} />
          <Button
            type="button"
            data-shortcut-new
            onClick={handleAdd}
            disabled={addDisabled}
            title={addTitle}
            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
          >
            <Plus className="mr-1 h-4 w-4" /> Add income
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
              Received this month
            </CardDescription>
            <CardTitle className="text-2xl text-emerald-400">
              {formatCurrency(receivedTotal, currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <CardHeader>
            <CardDescription className="text-zinc-500">
              Pending this month
            </CardDescription>
            <CardTitle className="text-2xl text-amber-400">
              {formatCurrency(pendingTotal, currency)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {clients.length === 0 ? (
        <NoClientsState />
      ) : income.length === 0 ? (
        <EmptyState onAdd={handleAdd} disabled={limitReached} />
      ) : (
        <div className="space-y-3">
          <FilterBar
            clientFilter={clientFilter}
            onClientChange={setClientFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            search={search}
            onSearchChange={setSearch}
            clients={clients}
            hasUnassigned={income.some((i) => !i.client_id)}
          />
          {filtersActive && (
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                Showing {filteredCount} of {totalCount}
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
                      <SortableHeader
                        label="Client"
                        col="client"
                        sort={sort}
                        dir={dir}
                        onToggle={toggleSort}
                      />
                      <th className="px-4 py-2 text-left font-medium">Description</th>
                      <th className="px-4 py-2 text-left font-medium">Method</th>
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
                    {sorted.map((i) => (
                      <tr key={i.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30">
                        <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                          {formatDateShort(i.date)}
                        </td>
                        <td className="px-4 py-2.5">
                          {i.client ? (
                            <span className="inline-flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: i.client.color }}
                                aria-hidden
                              />
                              {i.client.name}
                            </span>
                          ) : (
                            <span className="text-zinc-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                          {i.description ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-500">
                          {getPaymentMethodLabel(i.payment_method)}
                        </td>
                        <td
                          className={`px-4 py-2.5 text-right font-medium ${i.status === "pending" ? "text-amber-400" : "text-emerald-400"}`}
                        >
                          {formatCurrency(Number(i.amount), currency)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit income"
                              onClick={() => setMode({ kind: "edit", income: i })}
                              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                              <Pencil />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete income"
                              onClick={() => setMode({ kind: "delete", income: i })}
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

      <IncomeFormDialog
        open={mode.kind === "create" || mode.kind === "edit"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        income={mode.kind === "edit" ? mode.income : null}
        clients={clients}
        key={mode.kind === "edit" ? mode.income.id : mode.kind}
      />

      <DeleteConfirmDialog
        open={mode.kind === "delete"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Delete income?"
        description="This will permanently remove this income entry."
        onConfirm={async () => {
          if (mode.kind !== "delete") return { success: false, error: "Invalid state" };
          return deleteIncomeAction(mode.income.id);
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
  clientFilter: string;
  onClientChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
  clients: ClientRecord[];
  hasUnassigned: boolean;
};

function FilterBar({
  clientFilter,
  onClientChange,
  statusFilter,
  onStatusChange,
  search,
  onSearchChange,
  clients,
  hasUnassigned,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <Input
          type="search"
          placeholder="Search description or client…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          data-search-input
          className="h-8 border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/40 pl-8 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      <Select
        value={clientFilter}
        onValueChange={(v) => v != null && onClientChange(v)}
      >
        <SelectTrigger
          aria-label="Client filter"
          className="h-8 w-full sm:w-44"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All clients</SelectItem>
          {hasUnassigned && <SelectItem value="unassigned">Unassigned</SelectItem>}
          {clients.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/40 p-0.5 text-xs">
        {(["all", "received", "pending"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onStatusChange(value)}
            className={cn(
              "rounded px-2.5 py-1 capitalize transition",
              statusFilter === value
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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
        <TrendingUp className="h-5 w-5 text-emerald-400" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        No income recorded this month
      </h2>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        {disabled
          ? "You've reached this month's transaction limit."
          : "Add your first payment to start tracking."}
      </p>
      <Button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        title={disabled ? "Limit reached — Upgrade to Pro" : undefined}
        className="mt-5 bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      >
        <Plus className="mr-1 h-4 w-4" /> Add income
      </Button>
    </div>
  );
}

function NoMatchesState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 px-6 py-12 text-center">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">No income matches your filters.</p>
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

function NoClientsState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 px-6 py-12 text-center">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        You need a client before you can record income.
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Head over to the Clients page and add one to get started.
      </p>
    </div>
  );
}
