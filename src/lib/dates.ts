export type MonthRange = {
  year: number;
  month: number;
  start: string;
  end: string;
  label: string;
};

export function buildMonthRange(year: number, month: number): MonthRange {
  const safeMonth = Math.min(Math.max(month, 1), 12);
  const start = new Date(Date.UTC(year, safeMonth - 1, 1));
  const end = new Date(Date.UTC(year, safeMonth, 0));
  const label = start.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return {
    year,
    month: safeMonth,
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    label,
  };
}

export function currentMonthRange(): MonthRange {
  const now = new Date();
  return buildMonthRange(now.getUTCFullYear(), now.getUTCMonth() + 1);
}

export function parseMonthParams(
  searchParams: Record<string, string | string[] | undefined>,
): MonthRange {
  const yearRaw = searchParams.year;
  const monthRaw = searchParams.month;
  const yearStr = Array.isArray(yearRaw) ? yearRaw[0] : yearRaw;
  const monthStr = Array.isArray(monthRaw) ? monthRaw[0] : monthRaw;
  const now = new Date();
  const year = Number(yearStr) || now.getUTCFullYear();
  const month = Number(monthStr) || now.getUTCMonth() + 1;
  return buildMonthRange(year, month);
}

export function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
