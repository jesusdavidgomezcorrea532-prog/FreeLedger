"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/components/dashboard/nav-items";
import type { PlanType } from "@/lib/plans";

function isActive(item: NavItem, pathname: string): boolean {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

type SidebarNavProps = {
  onNavigate?: () => void;
  plan?: PlanType;
};

const UPGRADE_HREF = "/dashboard/upgrade";

export function SidebarNav({ onNavigate, plan = "free" }: SidebarNavProps) {
  const pathname = usePathname() ?? "";
  const showUpgrade = plan === "free";
  const upgradeActive =
    pathname === UPGRADE_HREF || pathname.startsWith(`${UPGRADE_HREF}/`);

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
              active
                ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {showUpgrade && (
        <Link
          href={UPGRADE_HREF}
          onClick={onNavigate}
          className={cn(
            "mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
            upgradeActive
              ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
              : "text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400",
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="flex-1">Upgrade</span>
          <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
            New
          </span>
        </Link>
      )}
    </nav>
  );
}
