import { createClient } from "@/lib/supabase/server";
import { buildCsv, buildCsvFilename } from "@/lib/csv";
import { getCategoryLabel, getPaymentMethodLabel } from "@/lib/constants";
import type { ExpenseCategory, ExpenseType, PaymentMethod } from "@/types";

type IncomeRow = {
  date: string;
  amount: number;
  description: string | null;
  payment_method: PaymentMethod;
  status: string;
  client: { name: string | null } | null;
};

type ExpenseRow = {
  date: string;
  description: string;
  category: ExpenseCategory;
  expense_type: ExpenseType;
  deductible_pct: number;
  amount: number;
};

type ClientRow = {
  name: string;
  email: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [incomeRes, expensesRes, clientsRes] = await Promise.all([
    supabase
      .from("income")
      .select("date, amount, description, payment_method, status, client:clients(name)")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
    supabase
      .from("expenses")
      .select("date, description, category, expense_type, deductible_pct, amount")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
    supabase
      .from("clients")
      .select("name, email, is_active, notes, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (incomeRes.error || expensesRes.error || clientsRes.error) {
    const msg =
      incomeRes.error?.message ??
      expensesRes.error?.message ??
      clientsRes.error?.message ??
      "Failed to export data";
    return new Response(msg, { status: 500 });
  }

  const incomeRows = ((incomeRes.data ?? []) as unknown as IncomeRow[]).map((r) => [
    r.date,
    r.client?.name ?? "",
    r.description ?? "",
    Number(r.amount).toFixed(2),
    getPaymentMethodLabel(r.payment_method),
    r.status === "received" ? "Received" : "Pending",
  ]);

  const expenseRows = ((expensesRes.data ?? []) as ExpenseRow[]).map((r) => [
    r.date,
    r.description,
    getCategoryLabel(r.category),
    r.expense_type === "business"
      ? "Business"
      : r.expense_type === "personal"
        ? "Personal"
        : "Mixed",
    String(r.deductible_pct),
    Number(r.amount).toFixed(2),
  ]);

  const clientRows = ((clientsRes.data ?? []) as ClientRow[]).map((r) => [
    r.name,
    r.email ?? "",
    r.is_active ? "Active" : "Archived",
    r.notes ?? "",
    r.created_at,
  ]);

  const incomeCsv = buildCsv(
    ["Date", "Client", "Description", "Amount", "Payment Method", "Status"],
    incomeRows,
  );
  const expensesCsv = buildCsv(
    ["Date", "Description", "Category", "Type", "Deductible %", "Amount"],
    expenseRows,
  );
  const clientsCsv = buildCsv(
    ["Name", "Email", "Status", "Notes", "Created At"],
    clientRows,
  );

  const combined = [
    "# FreeLedger export",
    `# Generated: ${new Date().toISOString()}`,
    "",
    "# Income",
    incomeCsv,
    "",
    "# Expenses",
    expensesCsv,
    "",
    "# Clients",
    clientsCsv,
    "",
  ].join("\n");

  return new Response(combined, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${buildCsvFilename("all")}"`,
      "Cache-Control": "no-store",
    },
  });
}
