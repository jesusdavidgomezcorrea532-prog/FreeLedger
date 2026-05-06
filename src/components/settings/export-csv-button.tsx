"use client";

import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OPTIONS = [
  { href: "/api/export/income", label: "Income (CSV)" },
  { href: "/api/export/expenses", label: "Expenses (CSV)" },
  { href: "/api/export/all", label: "All data (CSV)" },
] as const;

export function ExportCsvButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export CSV
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-44">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.href}
            nativeButton={false}
            render={
              <a href={opt.href} download>
                {opt.label}
              </a>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
