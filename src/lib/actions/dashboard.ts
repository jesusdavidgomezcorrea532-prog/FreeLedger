"use server";

import { createClient } from "@/lib/supabase/server";
import { buildMonthRange } from "@/lib/dates";
import { getCategoryLabel } from "@/lib/constants";
import { CLIENT_COLORS } from "@/lib/constants";
import type { ExpenseCategory, ExpenseRecord, IncomeWithClient } from "@/types";

export type DashboardSummary = {
  totalIncome: number;
  pendingIncome: number;
  totalExpenses: number;
  businessExpenses: number;
  personalExpenses: number;
  mixedExpenses: number;
  deductibleAmount: number;
  taxReserve: number;
  realMoney: number;
};

export type IncomeByClientPoint = {
  clientId: string;
  clientName: string;
  clientColor: string;
  total: number;
  percentage: number;
};

export type MonthlyTrendPoint = {
  month: string;
  year: number;
  monthIndex: number;
  income: number;
  expenses: number;
  realMoney: number;
};

export type ExpensesByCategoryPoint = {
  category: ExpenseCategory;
  label: string;
  total: number;
  percentage: number;
};

export type RecentTransaction = {
  id: string;
  kind: "income" | "expense";
  amount: number;
  date: string;
  description: string | null;
  meta: string;
  status?: "received" | "pending";
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EMPTY_SUMMARY: DashboardSummary = {
  totalIncome: 0,
  pendingIncome: 0,
  totalExpenses: 0,
  businessExpenses: 0,
  personalExpenses: 0,
  mixedExpenses: 0,
  deductibleAmount: 0,
  taxReserve: 0,
  realMoney: 0,
};

async function getAuthedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getDashboardSummary(
  year: number,
  month: number,
): Promise<DashboardSummary> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return EMPTY_SUMMARY;

  const range = buildMonthRange(year, month);

  const [incomeRes, expenseRes, userRes] = await Promise.all([
    supabase
      .from("income")
      .select("amount, status")
      .eq("user_id", user.id)
      .gte("date", range.start)
      .lte("date", range.end),
    supabase
      .from("expenses")
      .select("amount, expense_type, deductible_pct")
      .eq("user_id", user.id)
      .gte("date", range.start)
      .lte("date", range.end),
    supabase
      .from("users")
      .select("tax_rate")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (incomeRes.error || expenseRes.error) return EMPTY_SUMMARY;

  let totalIncome = 0;
  let pendingIncome = 0;
  for (const row of incomeRes.data ?? []) {
    const amount = Number(row.amount) || 0;
    if (row.status === "pending") pendingIncome += amount;
    else totalIncome += amount;
  }

  let totalExpenses = 0;
  let businessExpenses = 0;
  let personalExpenses = 0;
  let mixedExpenses = 0;
  let deductibleAmount = 0;
  for (const row of expenseRes.data ?? []) {
    const amount = Number(row.amount) || 0;
    const pct = Number(row.deductible_pct) || 0;
    totalExpenses += amount;
    deductibleAmount += amount * (pct / 100);
    if (row.expense_type === "business") businessExpenses += amount;
    else if (row.expense_type === "personal") personalExpenses += amount;
    else if (row.expense_type === "mixed") mixedExpenses += amount;
  }

  const taxRate = Number(userRes.data?.tax_rate) || 0;
  const taxableBase = Math.max(totalIncome - deductibleAmount, 0);
  const taxReserve = (taxableBase * taxRate) / 100;
  const realMoney = totalIncome - totalExpenses - taxReserve;

  return {
    totalIncome,
    pendingIncome,
    totalExpenses,
    businessExpenses,
    personalExpenses,
    mixedExpenses,
    deductibleAmount,
    taxReserve,
    realMoney,
  };
}

export async function getIncomeByClient(
  year: number,
  month: number,
): Promise<IncomeByClientPoint[]> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return [];

  const range = buildMonthRange(year, month);

  const { data, error } = await supabase
    .from("income")
    .select("amount, status, client:clients(id, name, color)")
    .eq("user_id", user.id)
    .eq("status", "received")
    .gte("date", range.start)
    .lte("date", range.end);

  if (error || !data) return [];

  const rows = data as unknown as Array<{
    amount: number | string;
    client: { id: string; name: string; color: string | null } | null;
  }>;

  const map = new Map<string, IncomeByClientPoint>();
  let grandTotal = 0;

  for (const row of rows) {
    const amount = Number(row.amount) || 0;
    grandTotal += amount;
    const clientId = row.client?.id ?? "__unassigned__";
    const existing = map.get(clientId);
    if (existing) {
      existing.total += amount;
    } else {
      map.set(clientId, {
        clientId,
        clientName: row.client?.name ?? "Unassigned",
        clientColor: row.client?.color ?? CLIENT_COLORS[0],
        total: amount,
        percentage: 0,
      });
    }
  }

  const result = Array.from(map.values());
  for (const point of result) {
    point.percentage =
      grandTotal > 0 ? (point.total / grandTotal) * 100 : 0;
  }
  result.sort((a, b) => b.total - a.total);
  return result;
}

export async function getMonthlyTrend(
  months: number = 6,
): Promise<MonthlyTrendPoint[]> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return [];

  const safeMonths = Math.min(Math.max(months, 1), 24);
  const now = new Date();
  const baseYear = now.getUTCFullYear();
  const baseMonth = now.getUTCMonth() + 1;

  const ranges = Array.from({ length: safeMonths }).map((_, i) => {
    const offset = safeMonths - 1 - i;
    let m = baseMonth - offset;
    let y = baseYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    return buildMonthRange(y, m);
  });

  const earliest = ranges[0];
  const latest = ranges[ranges.length - 1];

  const userRes = await supabase
    .from("users")
    .select("tax_rate")
    .eq("id", user.id)
    .maybeSingle();
  const taxRate = Number(userRes.data?.tax_rate) || 0;

  const [incomeRes, expensesRes] = await Promise.all([
    supabase
      .from("income")
      .select("amount, status, date")
      .eq("user_id", user.id)
      .eq("status", "received")
      .gte("date", earliest.start)
      .lte("date", latest.end),
    supabase
      .from("expenses")
      .select("amount, deductible_pct, date")
      .eq("user_id", user.id)
      .gte("date", earliest.start)
      .lte("date", latest.end),
  ]);

  const incomeByMonth = new Map<string, number>();
  for (const row of incomeRes.data ?? []) {
    const key = (row.date as string).slice(0, 7);
    incomeByMonth.set(key, (incomeByMonth.get(key) ?? 0) + (Number(row.amount) || 0));
  }

  const expensesByMonth = new Map<string, number>();
  const deductibleByMonth = new Map<string, number>();
  for (const row of expensesRes.data ?? []) {
    const key = (row.date as string).slice(0, 7);
    const amount = Number(row.amount) || 0;
    const pct = Number(row.deductible_pct) || 0;
    expensesByMonth.set(key, (expensesByMonth.get(key) ?? 0) + amount);
    deductibleByMonth.set(
      key,
      (deductibleByMonth.get(key) ?? 0) + amount * (pct / 100),
    );
  }

  return ranges.map((r) => {
    const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
    const income = incomeByMonth.get(key) ?? 0;
    const expenses = expensesByMonth.get(key) ?? 0;
    const deductible = deductibleByMonth.get(key) ?? 0;
    const taxableBase = Math.max(income - deductible, 0);
    const taxReserve = (taxableBase * taxRate) / 100;
    const realMoney = income - expenses - taxReserve;
    return {
      month: SHORT_MONTHS[r.month - 1],
      year: r.year,
      monthIndex: r.month,
      income,
      expenses,
      realMoney,
    };
  });
}

export async function getExpensesByCategory(
  year: number,
  month: number,
): Promise<ExpensesByCategoryPoint[]> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return [];

  const range = buildMonthRange(year, month);

  const { data, error } = await supabase
    .from("expenses")
    .select("amount, category")
    .eq("user_id", user.id)
    .gte("date", range.start)
    .lte("date", range.end);

  if (error || !data) return [];

  const map = new Map<ExpenseCategory, number>();
  let grandTotal = 0;
  for (const row of data) {
    const amount = Number(row.amount) || 0;
    const category = (row.category as ExpenseCategory) ?? "other";
    grandTotal += amount;
    map.set(category, (map.get(category) ?? 0) + amount);
  }

  const result: ExpensesByCategoryPoint[] = Array.from(map.entries()).map(
    ([category, total]) => ({
      category,
      label: getCategoryLabel(category),
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }),
  );
  result.sort((a, b) => b.total - a.total);
  return result;
}

export async function getRecentTransactions(
  limit: number = 5,
): Promise<RecentTransaction[]> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return [];

  const safeLimit = Math.min(Math.max(limit, 1), 20);

  const [incomeRes, expensesRes] = await Promise.all([
    supabase
      .from("income")
      .select("id, amount, description, date, status, client:clients(name)")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(safeLimit),
    supabase
      .from("expenses")
      .select("id, amount, description, date, category")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(safeLimit),
  ]);

  const incomeRows = (incomeRes.data ?? []) as unknown as Array<
    Pick<IncomeWithClient, "id" | "amount" | "description" | "date" | "status"> & {
      client: { name: string } | null;
    }
  >;
  const expenseRows = (expensesRes.data ?? []) as unknown as Array<
    Pick<ExpenseRecord, "id" | "amount" | "description" | "date" | "category">
  >;

  const incomeTransactions: RecentTransaction[] = incomeRows.map((row) => ({
    id: row.id,
    kind: "income",
    amount: Number(row.amount) || 0,
    date: row.date,
    description: row.description ?? null,
    meta: row.client?.name ?? "Unassigned",
    status: row.status,
  }));

  const expenseTransactions: RecentTransaction[] = expenseRows.map((row) => ({
    id: row.id,
    kind: "expense",
    amount: Number(row.amount) || 0,
    date: row.date,
    description: row.description ?? null,
    meta: getCategoryLabel(row.category),
  }));

  return [...incomeTransactions, ...expenseTransactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, safeLimit);
}
