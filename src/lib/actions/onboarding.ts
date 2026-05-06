"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CLIENT_COLORS, COUNTRIES, CURRENCIES } from "@/lib/constants";
import type { ActionResult } from "@/types";

const VALID_COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));
const VALID_CURRENCY_CODES = new Set(CURRENCIES.map((c) => c.code));
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type OnboardingPayload = {
  country: string;
  currency: string;
  taxRate: number;
  fiscalYearStart: number;
  client?: {
    name: string;
    email?: string;
    color: string;
  };
};

export async function completeOnboardingAction(
  payload: OnboardingPayload,
): Promise<ActionResult> {
  if (!VALID_COUNTRY_CODES.has(payload.country)) {
    return { success: false, error: "Please pick a valid country." };
  }
  if (!VALID_CURRENCY_CODES.has(payload.currency)) {
    return { success: false, error: "Please pick a valid currency." };
  }

  const taxRate = Math.min(Math.max(Number(payload.taxRate) || 0, 0), 50);
  const fiscalYearStart = Math.min(
    Math.max(Math.round(Number(payload.fiscalYearStart) || 1), 1),
    12,
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { error: userError } = await supabase
    .from("users")
    .update({
      country: payload.country,
      currency: payload.currency,
      tax_rate: taxRate,
      fiscal_year_start: fiscalYearStart,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (userError) {
    return { success: false, error: userError.message };
  }

  if (payload.client) {
    const name = payload.client.name.trim();
    const email = payload.client.email?.trim() ?? "";
    if (!name) {
      return { success: false, error: "Client name is required." };
    }
    if (email && !EMAIL_REGEX.test(email)) {
      return { success: false, error: "Please enter a valid client email." };
    }
    const color = CLIENT_COLORS.includes(payload.client.color)
      ? payload.client.color
      : CLIENT_COLORS[0];

    const { error: clientError } = await supabase.from("clients").insert({
      user_id: user.id,
      name,
      email: email || null,
      color,
      is_active: true,
    });

    if (clientError) {
      return { success: false, error: clientError.message };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { success: true, message: "Onboarding complete." };
}

export async function finishOnboardingAndRedirect(
  payload: OnboardingPayload,
): Promise<ActionResult> {
  const result = await completeOnboardingAction(payload);
  if (!result.success) return result;
  redirect("/dashboard");
}
