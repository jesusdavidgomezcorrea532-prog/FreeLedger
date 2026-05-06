"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { COUNTRIES, CURRENCIES } from "@/lib/constants";
import type { ActionResult, UserRecord } from "@/types";

const VALID_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));
const VALID_CURRENCY_CODES = new Set(CURRENCIES.map((c) => c.code));

export type UserSettingsState = ActionResult & { timestamp?: number };

export async function getUserRecord(): Promise<UserRecord | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserRecord;
}

export async function updateProfileAction(
  _prev: UserSettingsState | null,
  formData: FormData,
): Promise<UserSettingsState> {
  const timestamp = Date.now();
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!displayName) {
    return { success: false, error: "Display name is required.", timestamp };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated.", timestamp };
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        display_name: displayName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message, timestamp };
  }
  if (!data) {
    return {
      success: false,
      error: "Profile could not be saved. Please try again.",
      timestamp,
    };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true, message: "Profile updated.", timestamp };
}

export async function updateFinancialAction(
  _prev: UserSettingsState | null,
  formData: FormData,
): Promise<UserSettingsState> {
  const timestamp = Date.now();
  const country = String(formData.get("country") ?? "").trim();
  const currency = String(formData.get("currency") ?? "").trim();
  const taxRateRaw = String(formData.get("tax_rate") ?? "").trim();
  const fiscalRaw = String(formData.get("fiscal_year_start") ?? "").trim();

  if (!VALID_COUNTRY_CODES.has(country)) {
    return { success: false, error: "Invalid country.", timestamp };
  }
  if (!VALID_CURRENCY_CODES.has(currency)) {
    return { success: false, error: "Invalid currency.", timestamp };
  }

  const taxRate = Math.min(Math.max(Number(taxRateRaw) || 0, 0), 50);
  const fiscalYearStart = Math.min(
    Math.max(Math.round(Number(fiscalRaw) || 1), 1),
    12,
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated.", timestamp };
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        country,
        currency,
        tax_rate: taxRate,
        fiscal_year_start: fiscalYearStart,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id, country, currency, tax_rate, fiscal_year_start")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message, timestamp };
  }
  if (!data) {
    return {
      success: false,
      error: "Financial settings could not be saved. Please try again.",
      timestamp,
    };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard/expenses");
  return { success: true, message: "Financial settings updated.", timestamp };
}
