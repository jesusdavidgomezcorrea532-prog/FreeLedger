import { redirect } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_COUNTRY } from "@/lib/constants";

export const metadata = {
  title: "Welcome to FreeLedger",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: userRow }, { count: clientCount }] = await Promise.all([
    supabase
      .from("users")
      .select("country, currency, tax_rate, fiscal_year_start")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const country = userRow?.country ?? DEFAULT_COUNTRY;
  const onboardingComplete = country !== DEFAULT_COUNTRY || (clientCount ?? 0) > 0;

  if (onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <OnboardingWizard
        initial={{
          country: userRow?.country ?? DEFAULT_COUNTRY,
          currency: userRow?.currency ?? "USD",
          taxRate: Number(userRow?.tax_rate ?? 25),
          fiscalYearStart: Number(userRow?.fiscal_year_start ?? 1),
        }}
      />
    </div>
  );
}
