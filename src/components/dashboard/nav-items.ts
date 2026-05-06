import {
  ChartBar,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: "exact" | "prefix";
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: ChartBar, match: "exact" },
  { href: "/dashboard/income", label: "Income", icon: TrendingUp, match: "prefix" },
  {
    href: "/dashboard/expenses",
    label: "Expenses",
    icon: TrendingDown,
    match: "prefix",
  },
  { href: "/dashboard/clients", label: "Clients", icon: Users, match: "prefix" },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    match: "prefix",
  },
] as const;
