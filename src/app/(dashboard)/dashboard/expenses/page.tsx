import { getMonthlyExpenses } from "@/lib/actions/expenses";
import { getUserRecord } from "@/lib/actions/settings";
import { ExpensesPageClient } from "@/components/expenses/expenses-page-client";
import { parseMonthParams } from "@/lib/dates";

export const metadata = {
  title: "Expenses",
};

function readParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | null {
  const value = searchParams[key];
  const v = Array.isArray(value) ? value[0] : value;
  return v ? v : null;
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const range = parseMonthParams(sp);

  const [expenses, userRecord] = await Promise.all([
    getMonthlyExpenses(range.year, range.month),
    getUserRecord(),
  ]);

  const initialCategory = readParam(sp, "category");
  const typeRaw = readParam(sp, "type");
  const initialType =
    typeRaw === "business" || typeRaw === "personal" || typeRaw === "mixed"
      ? typeRaw
      : "all";
  const initialSearch = readParam(sp, "search") ?? "";
  const sortRaw = readParam(sp, "sort");
  const initialSort =
    sortRaw === "amount" || sortRaw === "category" ? sortRaw : "date";
  const dirRaw = readParam(sp, "dir");
  const initialDir = dirRaw === "asc" ? "asc" : "desc";
  const initialAction = readParam(sp, "action");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <ExpensesPageClient
        expenses={expenses}
        year={range.year}
        month={range.month}
        monthLabel={range.label}
        currency={userRecord?.currency ?? "USD"}
        initialCategory={initialCategory}
        initialType={initialType}
        initialSearch={initialSearch}
        initialSort={initialSort}
        initialDir={initialDir}
        initialAction={initialAction}
      />
    </div>
  );
}
