"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildMonthRange } from "@/lib/dates";
import type {
  ActionResult,
  IncomeRecord,
  IncomeStatus,
  IncomeWithClient,
  PaymentMethod,
} from "@/types";

const PAYMENT_METHODS: readonly PaymentMethod[] = [
  "bank_transfer",
  "paypal",
  "stripe",
  "cash",
  "crypto",
  "other",
];

const STATUSES: readonly IncomeStatus[] = ["received", "pending"];

function parseIncomeForm(formData: FormData) {
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const paymentRaw = String(formData.get("payment_method") ?? "bank_transfer").trim();
  const statusRaw = String(formData.get("status") ?? "received").trim();

  const amount = Number(amountRaw);
  if (!amountRaw || Number.isNaN(amount) || amount <= 0) {
    return { error: "Amount must be greater than zero." } as const;
  }

  if (!clientId) {
    return { error: "Please select a client." } as const;
  }

  if (!date) {
    return { error: "Date is required." } as const;
  }

  const payment_method = (PAYMENT_METHODS as readonly string[]).includes(paymentRaw)
    ? (paymentRaw as PaymentMethod)
    : "bank_transfer";

  const status = (STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as IncomeStatus)
    : "received";

  return {
    error: null,
    values: {
      amount,
      client_id: clientId,
      description: description || null,
      date,
      payment_method,
      status,
    },
  } as const;
}

export async function getMonthlyIncome(
  year: number,
  month: number,
): Promise<IncomeWithClient[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const range = buildMonthRange(year, month);

  const { data, error } = await supabase
    .from("income")
    .select("*, client:clients(id, name, color)")
    .eq("user_id", user.id)
    .gte("date", range.start)
    .lte("date", range.end)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as IncomeWithClient[];
}

export async function createIncomeAction(
  formData: FormData,
): Promise<ActionResult<IncomeRecord>> {
  const parsed = parseIncomeForm(formData);
  if (parsed.error) {
    return { success: false, error: parsed.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { data, error } = await supabase
    .from("income")
    .insert({ ...parsed.values, user_id: user.id })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  return { success: true, data: data as IncomeRecord, message: "Income added." };
}

export async function updateIncomeAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseIncomeForm(formData);
  if (parsed.error) {
    return { success: false, error: parsed.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("income")
    .update(parsed.values)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  return { success: true, message: "Income updated." };
}

export async function deleteIncomeAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("income")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  return { success: true, message: "Income deleted." };
}
