"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS } from "@/lib/constants";

type MonthPickerProps = {
  basePath: string;
  year: number;
  month: number;
};

export function MonthPicker({ basePath, year, month }: MonthPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setMonth = (nextYear: number, nextMonth: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("year", String(nextYear));
    params.set("month", String(nextMonth));
    router.push(`${basePath}?${params.toString()}`);
  };

  const goPrev = () => {
    const m = month === 1 ? 12 : month - 1;
    const y = month === 1 ? year - 1 : year;
    setMonth(y, m);
  };

  const goNext = () => {
    const m = month === 12 ? 1 : month + 1;
    const y = month === 12 ? year + 1 : year;
    setMonth(y, m);
  };

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Previous month"
        onClick={goPrev}
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ChevronLeft />
      </Button>
      <Select
        value={String(month)}
        onValueChange={(v) => v != null && setMonth(year, Number(v))}
      >
        <SelectTrigger
          aria-label="Month"
          size="sm"
          className="h-7 border-0 bg-transparent"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={String(m.value)}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(year)}
        onValueChange={(v) => v != null && setMonth(Number(v), month)}
      >
        <SelectTrigger
          aria-label="Year"
          size="sm"
          className="h-7 border-0 bg-transparent"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 6 }).map((_, i) => {
            const y = new Date().getUTCFullYear() - 4 + i;
            return (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Next month"
        onClick={goNext}
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
