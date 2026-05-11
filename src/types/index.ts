export type WaitlistEntry = {
  id: string;
  email: string;
  created_at: string;
};

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export type UserPlan = "free" | "pro" | "lifetime";

export type UserRecord = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  country: string;
  tax_rate: number;
  fiscal_year_start: number;
  currency: string;
  plan: UserPlan;
  created_at: string;
  updated_at: string;
};

export type ClientRecord = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  color: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentMethod =
  | "bank_transfer"
  | "paypal"
  | "stripe"
  | "cash"
  | "crypto"
  | "other";

export type IncomeStatus = "received" | "pending";

export type IncomeRecord = {
  id: string;
  user_id: string;
  client_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  payment_method: PaymentMethod;
  status: IncomeStatus;
  created_at: string;
};

export type IncomeWithClient = IncomeRecord & {
  client: Pick<ClientRecord, "id" | "name" | "color"> | null;
};

export type ExpenseCategory =
  | "software"
  | "hardware"
  | "office"
  | "travel"
  | "education"
  | "food"
  | "rent"
  | "utilities"
  | "health"
  | "entertainment"
  | "marketing"
  | "professional_services"
  | "other";

export type ExpenseType = "business" | "personal" | "mixed";

export type ExpenseRecord = {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  expense_type: ExpenseType;
  deductible_pct: number;
  date: string;
  created_at: string;
};
