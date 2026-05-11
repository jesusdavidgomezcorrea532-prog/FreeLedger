"use server";

import { createClient } from "@/lib/supabase/server";
import { currentMonthRange } from "@/lib/dates";
import { PLANS, normalizePlan, type PlanType } from "@/lib/plans";

export type LimitCheck = {
  allowed: boolean;
  current: number;
  limit: number;
};

export type Usage = {
  clients: number;
  transactionsThisMonth: number;
  plan: PlanType;
};

async function getUserPlan(userId: string): Promise<PlanType> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();
  return normalizePlan(data?.plan as string | null | undefined);
}

async function countClients(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

async function countTransactionsThisMonth(userId: string): Promise<number> {
  const supabase = await createClient();
  const range = currentMonthRange();

  const [incomeRes, expensesRes] = await Promise.all([
    supabase
      .from("income")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("date", range.start)
      .lte("date", range.end),
    supabase
      .from("expenses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("date", range.start)
      .lte("date", range.end),
  ]);

  return (incomeRes.count ?? 0) + (expensesRes.count ?? 0);
}

export async function canCreateClient(userId: string): Promise<LimitCheck> {
  const [plan, current] = await Promise.all([
    getUserPlan(userId),
    countClients(userId),
  ]);
  const limit = PLANS[plan].maxClients;
  return {
    allowed: current < limit,
    current,
    limit,
  };
}

export async function canCreateTransaction(userId: string): Promise<LimitCheck> {
  const [plan, current] = await Promise.all([
    getUserPlan(userId),
    countTransactionsThisMonth(userId),
  ]);
  const limit = PLANS[plan].maxTransactionsPerMonth;
  return {
    allowed: current < limit,
    current,
    limit,
  };
}

export async function getUsage(userId: string): Promise<Usage> {
  const [plan, clients, transactionsThisMonth] = await Promise.all([
    getUserPlan(userId),
    countClients(userId),
    countTransactionsThisMonth(userId),
  ]);
  return { plan, clients, transactionsThisMonth };
}

export async function getCurrentUserUsage(): Promise<Usage | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getUsage(user.id);
}
