export const PLANS = {
  free: {
    name: "Free",
    maxClients: 3,
    maxTransactionsPerMonth: 30,
    canExportCSV: true,
    price: 0,
  },
  pro: {
    name: "Pro",
    maxClients: Infinity,
    maxTransactionsPerMonth: Infinity,
    canExportCSV: true,
    price: 9,
  },
  lifetime: {
    name: "Lifetime",
    maxClients: Infinity,
    maxTransactionsPerMonth: Infinity,
    canExportCSV: true,
    price: 69,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const PLAN_TYPES: readonly PlanType[] = ["free", "pro", "lifetime"];

export function isPlanType(value: string | null | undefined): value is PlanType {
  return value === "free" || value === "pro" || value === "lifetime";
}

export function normalizePlan(value: string | null | undefined): PlanType {
  return isPlanType(value) ? value : "free";
}
