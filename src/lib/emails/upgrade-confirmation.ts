import { emailButton, emailLayout, escapeHtml } from "./components";

export type UpgradePlan = "pro" | "lifetime";

export interface UpgradeEmailParams {
  name?: string | null;
  plan: UpgradePlan;
  dashboardUrl: string;
}

export function upgradeEmailSubject(plan: UpgradePlan): string {
  return plan === "lifetime"
    ? "Welcome to FreeLedger Lifetime! 🎉"
    : "Welcome to FreeLedger Pro! 🚀";
}

export function upgradeEmailHtml({ name, plan, dashboardUrl }: UpgradeEmailParams): string {
  const greetingName = name && name.trim().length > 0
    ? escapeHtml(name.trim().split(/\s+/)[0])
    : "there";

  const isLifetime = plan === "lifetime";
  const planLabel = isLifetime ? "Lifetime" : "Pro";

  const lifetimeNote = isLifetime
    ? `<p style="margin: 0 0 16px 0;">You have lifetime access — no monthly fees, ever. Thank you for being one of the first 200!</p>`
    : "";

  const body = `
    <p style="margin: 0 0 16px 0;">Hi ${greetingName},</p>
    <p style="margin: 0 0 16px 0;">Your FreeLedger ${planLabel} plan is now active!</p>
    <p style="margin: 0 0 12px 0;">Here's what's unlocked:</p>
    <ul style="margin: 0 0 16px 20px; padding: 0;">
      <li style="margin: 0 0 6px 0;">Unlimited clients</li>
      <li style="margin: 0 0 6px 0;">Unlimited transactions</li>
      <li style="margin: 0 0 6px 0;">CSV export</li>
      <li style="margin: 0 0 6px 0;">Advanced filters</li>
    </ul>
    ${emailButton("Go to Dashboard", dashboardUrl)}
    ${lifetimeNote}
    <p style="margin: 0 0 16px 0;">Thank you for supporting FreeLedger. If you ever need anything, just reply to this email.</p>
    <p style="margin: 0;">— Jesús</p>
  `;

  return emailLayout({
    preheader: isLifetime
      ? "Your FreeLedger Lifetime plan is active."
      : "Your FreeLedger Pro plan is active.",
    body,
  });
}

export function upgradeEmailText({ name, plan, dashboardUrl }: UpgradeEmailParams): string {
  const greetingName = name && name.trim().length > 0 ? name.trim().split(/\s+/)[0] : "there";
  const planLabel = plan === "lifetime" ? "Lifetime" : "Pro";
  const lifetimeNote =
    plan === "lifetime"
      ? "\nYou have lifetime access — no monthly fees, ever. Thank you for being one of the first 200!\n"
      : "";

  return `Hi ${greetingName},

Your FreeLedger ${planLabel} plan is now active!

Here's what's unlocked:
- Unlimited clients
- Unlimited transactions
- CSV export
- Advanced filters

Go to your dashboard: ${dashboardUrl}
${lifetimeNote}
Thank you for supporting FreeLedger. If you ever need anything, just reply to this email.

— Jesús

You're receiving this because you signed up for FreeLedger. freeledger.dev`;
}
