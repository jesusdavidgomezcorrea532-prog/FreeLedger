import { createClient } from "@/lib/supabase/server";
import { buildCsv, buildCsvFilename } from "@/lib/csv";
import { getPaymentMethodLabel } from "@/lib/constants";
import type { PaymentMethod } from "@/types";

type IncomeRow = {
  date: string;
  amount: number;
  description: string | null;
  payment_method: PaymentMethod;
  status: string;
  client: { name: string | null } | null;
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
    .from("income")
    .select("date, amount, description, payment_method, status, client:clients(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    return new Response(`Failed to fetch income: ${error.message}`, { status: 500 });
  }

  const rows = ((data ?? []) as unknown as IncomeRow[]).map((r) => [
    r.date,
    r.client?.name ?? "",
    r.description ?? "",
    Number(r.amount).toFixed(2),
    getPaymentMethodLabel(r.payment_method),
    r.status === "received" ? "Received" : "Pending",
  ]);

  const csv = buildCsv(
    ["Date", "Client", "Description", "Amount", "Payment Method", "Status"],
    rows,
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${buildCsvFilename("income")}"`,
      "Cache-Control": "no-store",
    },
  });
}
