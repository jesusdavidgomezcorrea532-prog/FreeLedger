import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/settings/profile-form";
import { FinancialForm } from "@/components/settings/financial-form";
import { ExportCsvButton } from "@/components/settings/export-csv-button";
import { PlanCard } from "@/components/settings/plan-card";
import { getUserRecord } from "@/lib/actions/settings";
import { getCurrentUserUsage } from "@/lib/actions/limits";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [record, usage] = await Promise.all([
    getUserRecord(),
    getCurrentUserUsage(),
  ]);

  const displayName =
    record?.display_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    "";
  const email = record?.email ?? user?.email ?? "";

  const plan = usage?.plan ?? "free";
  const clients = usage?.clients ?? 0;
  const transactionsThisMonth = usage?.transactionsThisMonth ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Manage your profile and how FreeLedger calculates your numbers.
        </p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your name and contact info.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm displayName={displayName} email={email} />
        </CardContent>
      </Card>

      <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <CardHeader>
          <CardTitle>Financial</CardTitle>
          <CardDescription>
            Country, currency, and tax assumptions used across the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialForm
            key={`fin-${record?.updated_at ?? "new"}`}
            country={record?.country ?? "US"}
            currency={record?.currency ?? "USD"}
            taxRate={Number(record?.tax_rate ?? 25)}
            fiscalYearStart={Number(record?.fiscal_year_start ?? 1)}
          />
        </CardContent>
      </Card>

      <PlanCard
        plan={plan}
        clients={clients}
        transactionsThisMonth={transactionsThisMonth}
      />

      <Card className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Data and danger zone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/60 p-3">
            <div>
              <p className="text-sm text-zinc-800 dark:text-zinc-200">Export data</p>
              <p className="text-xs text-zinc-500">
                Download your income and expenses as CSV.
              </p>
            </div>
            <ExportCsvButton />
          </div>

          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <p className="text-sm font-medium text-red-300">Danger zone</p>
            <p className="mt-1 text-xs text-zinc-500">
              Permanently delete your account and all data. This action is
              irreversible.
            </p>
            <Button
              type="button"
              variant="destructive"
              disabled
              className="mt-3"
            >
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
