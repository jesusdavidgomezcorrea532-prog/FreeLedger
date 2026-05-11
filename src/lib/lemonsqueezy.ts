export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: { user_id: string };
  };
  data: {
    id: string;
    attributes: {
      status: string;
      variant_id: number;
      customer_id: number;
      product_id: number;
      first_order_item?: { variant_id: number };
    };
  };
}

export const LEMON_STORE_ID = 366692;

export const LEMON_VARIANTS = {
  pro_monthly: 1640634,
  lifetime: 1640642,
} as const;

// Checkout URLs from LemonSqueezy dashboard
// TODO: Replace with Live Mode URLs before launch
export const CHECKOUT_URLS = {
  pro_monthly: 'https://freeledger.lemonsqueezy.com/checkout/buy/8a61de0b-766b-478b-86aa-528c301d8bd8',
  lifetime: 'https://freeledger.lemonsqueezy.com/checkout/buy/a6b640b7-0a84-4230-bb92-c0e3eb93c77d',
} as const;

export type LemonVariant = keyof typeof LEMON_VARIANTS;

export function getCheckoutUrl(
  plan: LemonVariant,
  userId: string,
  userEmail: string,
): string {
  const baseUrl = CHECKOUT_URLS[plan];
  const params = new URLSearchParams({
    'checkout[custom][user_id]': userId,
    'checkout[email]': userEmail,
    'checkout[success_url]': 'https://freeledger.dev/dashboard?upgraded=true',
  });
  return `${baseUrl}?${params.toString()}`;
}
