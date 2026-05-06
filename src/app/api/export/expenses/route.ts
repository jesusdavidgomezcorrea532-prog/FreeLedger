import { createClient } from "@/lib/supabase/server";
import { buildCsv, buildCsvFilename } from "@/lib/csv";
import { getCategoryLabel } from "@/lib/constants";
import type { ExpenseCategory, ExpenseType } from "@/types";

type ExpenseRow = {
  date: string;
  description: string;
  category: ExpenseCategory;
  expense_type: ExpenseType;
  deductible_pct: number;
  amount: number;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("date, description, category, expense_type, deductible_pct, amount")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    return new Response(`Failed to fetch expenses: ${error.message}`, { status: 500 });
  }

  const rows = ((data ?? []) as ExpenseRow[]).map((r) => [
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

  const csv = buildCsv(
    ["Date", "Description", "Category", "Type", "Deductible %", "Amount"],
    rows,
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${buildCsvFilename("expenses")}"`,
      "Cache-Control": "no-store",
    },
  });
}
