"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CLIENT_COLORS } from "@/lib/constants";
import { canCreateClient } from "@/lib/actions/limits";
import type { ActionResult, ClientRecord } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseClientForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  const colorRaw = String(formData.get("color") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const isActiveRaw = formData.get("is_active");

  if (!name) {
    return { error: "Client name is required." } as const;
  }

  if (emailRaw && !EMAIL_REGEX.test(emailRaw)) {
    return { error: "Please enter a valid email address." } as const;
  }

  const color =
    colorRaw && CLIENT_COLORS.includes(colorRaw) ? colorRaw : CLIENT_COLORS[0];

  return {
    error: null,
    values: {
      name,
      email: emailRaw || null,
      color,
      notes: notesRaw || null,
      is_active:
        isActiveRaw === null || isActiveRaw === undefined
          ? true
          : isActiveRaw === "true" || isActiveRaw === "on",
    },
  } as const;
}

export async function getClients(): Promise<ClientRecord[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ClientRecord[];
}

export async function createClientAction(
  formData: FormData,
): Promise<ActionResult<ClientRecord>> {
  const parsed = parseClientForm(formData);
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

  const limit = await canCreateClient(user.id);
  if (!limit.allowed) {
    return {
      success: false,
      error: `You've reached the limit of ${limit.limit} clients on the Free plan. Upgrade to Pro for unlimited clients.`,
    };
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...parsed.values, user_id: user.id })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  return { success: true, data: data as ClientRecord, message: "Client added." };
}

export async function updateClientAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseClientForm(formData);
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
    .from("clients")
    .update({ ...parsed.values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/income");
  return { success: true, message: "Client updated." };
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/income");
  return { success: true, message: "Client deleted." };
}
