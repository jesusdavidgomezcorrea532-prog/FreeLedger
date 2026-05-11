import { getClients } from "@/lib/actions/clients";
import { getMonthlyIncome } from "@/lib/actions/income";
import { getCurrentUserUsage } from "@/lib/actions/limits";
import { getUserRecord } from "@/lib/actions/settings";
import { IncomePageClient } from "@/components/income/income-page-client";
import { parseMonthParams } from "@/lib/dates";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "Income",
};

function readParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | null {
  const value = searchParams[key];
  const v = Array.isArray(value) ? value[0] : value;
  return v ? v : null;
}

export default async function IncomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const range = parseMonthParams(sp);

  const [income, clients, userRecord, usage] = await Promise.all([
    getMonthlyIncome(range.year, range.month),
    getClients(),
    getUserRecord(),
    getCurrentUserUsage(),
  ]);

  const initialClient = readParam(sp, "client");
  const statusRaw = readParam(sp, "status");
  const initialStatus =
    statusRaw === "received" || statusRaw === "pending" ? statusRaw : "all";
  const initialSearch = readParam(sp, "search") ?? "";
  const sortRaw = readParam(sp, "sort");
  const initialSort =
    sortRaw === "amount" || sortRaw === "client" ? sortRaw : "date";
  const dirRaw = readParam(sp, "dir");
  const initialDir = dirRaw === "asc" ? "asc" : "desc";
  const initialAction = readParam(sp, "action");

  const plan = usage?.plan ?? "free";
  const transactionLimit = PLANS[plan].maxTransactionsPerMonth;
  const transactionsThisMonth = usage?.transactionsThisMonth ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <IncomePageClient
        income={income}
        clients={clients}
        year={range.year}
        month={range.month}
        monthLabel={range.label}
        currency={userRecord?.currency ?? "USD"}
        initialClientId={initialClient}
        initialStatus={initialStatus}
        initialSearch={initialSearch}
        initialSort={initialSort}
        initialDir={initialDir}
        initialAction={initialAction}
        plan={plan}
        transactionsThisMonth={transactionsThisMonth}
        transactionLimit={transactionLimit}
      />
    </div>
  );
}
