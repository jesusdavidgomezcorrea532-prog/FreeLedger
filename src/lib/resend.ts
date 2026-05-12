import { Resend } from "resend";

// Lazy singleton — instantiating Resend at module load fails the production
// build when RESEND_API_KEY isn't set, because Next collects page data with
// the env stripped. Defer until we actually send.
let client: Resend | null = null;

function getClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    client = new Resend(apiKey);
  }
  return client;
}

export const resend = {
  emails: {
    send: (params: Parameters<Resend["emails"]["send"]>[0]) =>
      getClient().emails.send(params),
  },
};

// Once the freeledger.dev domain is verified in Resend, this is the production
// sender. Until DNS is configured, swap to the onboarding fallback below.
export const FROM_EMAIL = "FreeLedger <noreply@freeledger.dev>";
// export const FROM_EMAIL = "FreeLedger <onboarding@resend.dev>";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://freeledger.dev";
