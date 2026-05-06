"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildMonthRange } from "@/lib/dates";
import type {
  ActionResult,
  ExpenseCategory,
  ExpenseRecord,
  ExpenseType,
} from "@/types";

const CATEGORIES: readonly ExpenseCategory[] = [
  "software",
  "hardware",
  "office",
  "travel",
  "education",
  "food",
  "rent",
  "utilities",
  "health",
  "entertainment",
  "marketing",
  "professional_services",
  "other",
];

const TYPES: readonly ExpenseType[] = ["business", "personal", "mixed"];

function parseExpenseForm(formData: FormData) {
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "other").trim();
  const typeRaw = String(formData.get("expense_type") ?? "business").trim();
  const deductibleRaw = String(formData.get("deductible_pct") ?? "100").trim();
  const date = String(formData.get("date") ?? "").trim();

  const amount = Number(amountRaw);
  if (!amountRaw || Number.isNaN(amount) || amount <= 0) {
    return { error: "Amount must be greater than zero." } as const;
  }

  if (!description) {
    return { error: "Description is required." } as const;
  }

  if (!date) {
    return { error: "Date is required." } as const;
  }

  const category = (CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as ExpenseCategory)
    : "other";

  const expense_type = (TYPES as readonly string[]).includes(typeRaw)
    ? (typeRaw as ExpenseType)
    : "business";

  let deductible_pct = Number(deductibleRaw);
  if (Number.isNaN(deductible_pct)) deductible_pct = 100;
  if (expense_type === "business") deductible_pct = 100;
  if (expense_type === "personal") deductible_pct = 0;
  deductible_pct = Math.min(Math.max(Math.round(deductible_pct), 0), 100);

  return {
    error: null,
    values: {
      amount,
      description,
      category,
      expense_type,
      deductible_pct,
      date,
    },
  } as const;
}

export async function getMonthlyExpenses(
  year: number,
  month: number,
): Promise<ExpenseRecord[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const range = buildMonthRange(year, month);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", range.start)
    .lte("date", range.end)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ExpenseRecord[];
}

export async function createExpenseAction(
  formData: FormData,
): Promise<ActionResult<ExpenseRecord>> {
  const parsed = parseExpenseForm(formData);
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
    .from("expenses")
    .insert({ ...parsed.values, user_id: user.id })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard");
  return { success: true, data: data as ExpenseRecord, message: "Expense added." };
}

export async function updateExpenseAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseExpenseForm(formData);
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
    .from("expenses")
    .update(parsed.values)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard");
  return { success: true, message: "Expense updated." };
}

export async function deleteExpenseAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard");
  return { success: true, message: "Expense deleted." };
}
