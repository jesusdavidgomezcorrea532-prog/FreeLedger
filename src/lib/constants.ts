import type {
  ExpenseCategory,
  ExpenseType,
  IncomeStatus,
  PaymentMethod,
} from "@/types";

export type CountryOption = {
  code: string;
  name: string;
  currency: string;
  taxRate: number;
};

export const COUNTRIES: readonly CountryOption[] = [
  { code: "US", name: "United States", currency: "USD", taxRate: 25 },
  { code: "GB", name: "United Kingdom", currency: "GBP", taxRate: 20 },
  { code: "CA", name: "Canada", currency: "CAD", taxRate: 26 },
  { code: "DE", name: "Germany", currency: "EUR", taxRate: 30 },
  { code: "FR", name: "France", currency: "EUR", taxRate: 28 },
  { code: "ES", name: "Spain", currency: "EUR", taxRate: 24 },
  { code: "IT", name: "Italy", currency: "EUR", taxRate: 27 },
  { code: "NL", name: "Netherlands", currency: "EUR", taxRate: 26 },
  { code: "PT", name: "Portugal", currency: "EUR", taxRate: 25 },
  { code: "IE", name: "Ireland", currency: "EUR", taxRate: 22 },
  { code: "AU", name: "Australia", currency: "AUD", taxRate: 22 },
  { code: "NZ", name: "New Zealand", currency: "NZD", taxRate: 20 },
  { code: "IN", name: "India", currency: "INR", taxRate: 20 },
  { code: "BR", name: "Brazil", currency: "BRL", taxRate: 20 },
  { code: "MX", name: "Mexico", currency: "MXN", taxRate: 22 },
  { code: "CO", name: "Colombia", currency: "COP", taxRate: 19 },
  { code: "AR", name: "Argentina", currency: "ARS", taxRate: 25 },
  { code: "CL", name: "Chile", currency: "CLP", taxRate: 22 },
  { code: "PE", name: "Peru", currency: "PEN", taxRate: 18 },
  { code: "JP", name: "Japan", currency: "JPY", taxRate: 23 },
] as const;

export const DEFAULT_COUNTRY = "US";

export const CURRENCIES: readonly { code: string; symbol: string; name: string }[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "NZD", symbol: "$", name: "New Zealand Dollar" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
] as const;

export const MONTHS: readonly { value: number; name: string }[] = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
] as const;

export const CLIENT_COLORS: readonly string[] = [
  "#10b981",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#6366f1",
] as const;

export const PAYMENT_METHODS: readonly { value: PaymentMethod; label: string }[] =
  [
    { value: "bank_transfer", label: "Bank transfer" },
    { value: "paypal", label: "PayPal" },
    { value: "stripe", label: "Stripe" },
    { value: "cash", label: "Cash" },
    { value: "crypto", label: "Crypto" },
    { value: "other", label: "Other" },
  ] as const;

export const INCOME_STATUSES: readonly { value: IncomeStatus; label: string }[] =
  [
    { value: "received", label: "Received" },
    { value: "pending", label: "Pending" },
  ] as const;

export const EXPENSE_CATEGORIES: readonly {
  value: ExpenseCategory;
  label: string;
}[] = [
  { value: "software", label: "Software" },
  { value: "hardware", label: "Hardware" },
  { value: "office", label: "Office" },
  { value: "travel", label: "Travel" },
  { value: "education", label: "Education" },
  { value: "food", label: "Food" },
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
  { value: "marketing", label: "Marketing" },
  { value: "professional_services", label: "Professional services" },
  { value: "other", label: "Other" },
] as const;

export const EXPENSE_TYPES: readonly { value: ExpenseType; label: string }[] = [
  { value: "business", label: "Business" },
  { value: "personal", label: "Personal" },
  { value: "mixed", label: "Mixed" },
] as const;

export function getCountry(code: string): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? "$";
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

export function getCategoryLabel(value: ExpenseCategory): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? "Other";
}

export function getPaymentMethodLabel(value: PaymentMethod): string {
  return PAYMENT_METHODS.find((p) => p.value === value)?.label ?? "Other";
}
