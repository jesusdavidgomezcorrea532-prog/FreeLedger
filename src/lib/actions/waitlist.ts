"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistState = ActionResult & { timestamp?: number };

export async function joinWaitlist(
  _prev: WaitlistState | null,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const timestamp = Date.now();

  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
      timestamp,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "You're already on the list!",
        timestamp,
      };
    }
    return {
      success: false,
      error: "Something went wrong. Please try again.",
      timestamp,
    };
  }

  return {
    success: true,
    message: "You're on the list! We'll notify you when FreeLedger launches.",
    timestamp,
  };
}
