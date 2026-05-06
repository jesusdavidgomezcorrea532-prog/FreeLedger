import { redirect } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { KeyboardShortcuts } from "@/components/dashboard/keyboard-shortcuts";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_COUNTRY } from "@/lib/constants";

export default async function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      .select("country, display_name, avatar_url, email")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const country = userRow?.country ?? DEFAULT_COUNTRY;
  const onboardingComplete = country !== DEFAULT_COUNTRY || (clientCount ?? 0) > 0;

  if (!onboardingComplete) {
    redirect("/onboarding");
  }

  const displayName =
    userRow?.display_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    "Account";

  const email = userRow?.email ?? user.email ?? "";

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <KeyboardShortcuts />
      <aside className="hidden w-[250px] shrink-0 flex-col border-r border-zinc-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950 lg:flex">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle size="sm" />
        </div>
        <div className="mt-8 flex-1">
          <SidebarNav />
        </div>
        <div className="mt-auto space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-900">
          <div className="px-2 text-xs">
            <p className="truncate text-zinc-700 dark:text-zinc-200">{displayName}</p>
            <p className="truncate text-zinc-500">{email}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80 lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <MobileNav displayName={displayName} email={email} />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
