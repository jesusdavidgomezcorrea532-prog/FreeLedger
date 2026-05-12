import { emailButton, emailLayout, escapeHtml } from "./components";

export interface WelcomeEmailParams {
  name?: string | null;
  dashboardUrl: string;
}

export function welcomeEmailSubject(): string {
  return "Welcome to FreeLedger! 🎉";
}

export function welcomeEmailHtml({ name, dashboardUrl }: WelcomeEmailParams): string {
  const greetingName = name && name.trim().length > 0
    ? escapeHtml(name.trim().split(/\s+/)[0])
    : "there";

  const body = `
    <p style="margin: 0 0 16px 0;">Hi ${greetingName},</p>
    <p style="margin: 0 0 16px 0;">Welcome to FreeLedger — the finance dashboard built for freelancers.</p>
    <p style="margin: 0 0 12px 0;">Here's how to get started:</p>
    <ol style="margin: 0 0 16px 20px; padding: 0;">
      <li style="margin: 0 0 6px 0;">Add your first client</li>
      <li style="margin: 0 0 6px 0;">Record your income and expenses</li>
      <li style="margin: 0 0 6px 0;">Check your Real Money dashboard</li>
    </ol>
    ${emailButton("Go to Dashboard", dashboardUrl)}
    <p style="margin: 0 0 16px 0;">If you have any questions, just reply to this email.</p>
    <p style="margin: 0;">— Jesús, founder of FreeLedger</p>
  `;

  return emailLayout({
    preheader: "Get started with FreeLedger in 3 quick steps.",
    body,
  });
}

export function welcomeEmailText({ name, dashboardUrl }: WelcomeEmailParams): string {
  const greetingName = name && name.trim().length > 0 ? name.trim().split(/\s+/)[0] : "there";
  return `Hi ${greetingName},

Welcome to FreeLedger — the finance dashboard built for freelancers.

Here's how to get started:
1. Add your first client
2. Record your income and expenses
3. Check your Real Money dashboard

Go to your dashboard: ${dashboardUrl}

If you have any questions, just reply to this email.

— Jesús, founder of FreeLedger

You're receiving this because you signed up for FreeLedger. freeledger.dev`;
}
