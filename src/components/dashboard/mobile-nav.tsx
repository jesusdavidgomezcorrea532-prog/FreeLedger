"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { PLANS, type PlanType } from "@/lib/plans";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  displayName: string;
  email: string;
  plan?: PlanType;
};

export function MobileNav({ displayName, email, plan = "free" }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open navigation"
            className="text-zinc-700 dark:text-zinc-300"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col gap-0 border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-0 sm:max-w-xs"
      >
        <SheetHeader className="border-b border-zinc-200 dark:border-zinc-900 p-5">
          <SheetTitle className="text-zinc-900 dark:text-zinc-100">
            <Logo />
          </SheetTitle>
          <SheetDescription className="sr-only">
            FreeLedger navigation
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav onNavigate={() => setOpen(false)} plan={plan} />
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-900 p-4 space-y-3">
          <div className="px-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-zinc-800 dark:text-zinc-200">
                {displayName}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  plan === "free"
                    ? "bg-zinc-200 text-zinc-700 ring-1 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                    : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
                )}
              >
                {PLANS[plan].name}
              </span>
            </div>
            <p className="truncate text-zinc-500">{email}</p>
          </div>
          <SignOutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
