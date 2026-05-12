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
  pro_monthly: 1634640,
  lifetime: 1634662,
} as const;

export const CHECKOUT_URLS = {
  pro_monthly: 'https://freeledger.lemonsqueezy.com/checkout/buy/ed08a4f9-0f2b-46ae-b1e9-7951d56ea2cb',
  lifetime: 'https://freeledger.lemonsqueezy.com/checkout/buy/86b3bc33-3abe-4964-a90f-3bdfd1a32bb9',
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
