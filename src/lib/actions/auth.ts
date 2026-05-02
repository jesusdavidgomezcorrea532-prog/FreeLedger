"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export type AuthState = ActionResult & { timestamp?: number };

export async function signInWithPassword(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");
  const timestamp = Date.now();

  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
      timestamp,
    };
  }

  if (!password) {
    return {
      success: false,
      error: "Please enter your password.",
      timestamp,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      success: false,
      error:
        error.message === "Invalid login credentials"
          ? "Invalid email or password."
          : error.message,
      timestamp,
    };
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signUpWithPassword(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const timestamp = Date.now();

  if (!name) {
    return { success: false, error: "Please enter your name.", timestamp };
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
      timestamp,
    };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      timestamp,
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match.", timestamp };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      timestamp,
    };
  }

  return {
    success: true,
    message: "Check your email to confirm your account.",
    timestamp,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
