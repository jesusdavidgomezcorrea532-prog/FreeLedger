import { redirect } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
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

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    "Account";

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-900 bg-zinc-950 p-5 lg:flex">
        <Logo />
        <nav className="mt-8 flex-1 space-y-1 text-sm text-zinc-500">
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Sidebar placeholder
          </p>
        </nav>
        <div className="mt-auto space-y-3 border-t border-zinc-900 pt-4">
          <div className="px-2 text-xs">
            <p className="truncate text-zinc-300">{displayName}</p>
            <p className="truncate text-zinc-500">{user.email}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
