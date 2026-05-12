import { emailLayout } from "./components";

export function waitlistConfirmationSubject(): string {
  return "You're on the FreeLedger waitlist!";
}

export function waitlistConfirmationHtml(): string {
  const body = `
    <p style="margin: 0 0 16px 0;">Hi!</p>
    <p style="margin: 0 0 16px 0;">Thanks for joining the FreeLedger waitlist. We're building the finance dashboard that freelancers actually need.</p>
    <p style="margin: 0 0 16px 0;">We'll let you know as soon as FreeLedger is ready for you.</p>
    <p style="margin: 0 0 12px 0;">In the meantime, follow our progress:</p>
    <ul style="margin: 0 0 16px 20px; padding: 0;">
      <li style="margin: 0 0 6px 0;">Twitter: <a href="https://twitter.com/FreeLedgerApp" style="color: #10b981; text-decoration: none;">@FreeLedgerApp</a></li>
      <li style="margin: 0 0 6px 0;">Website: <a href="https://freeledger.dev" style="color: #10b981; text-decoration: none;">freeledger.dev</a></li>
    </ul>
    <p style="margin: 0;">— Jesús, founder of FreeLedger</p>
  `;

  return emailLayout({
    preheader: "Thanks for joining the FreeLedger waitlist.",
    body,
  });
}

export function waitlistConfirmationText(): string {
  return `Hi!

Thanks for joining the FreeLedger waitlist. We're building the finance dashboard that freelancers actually need.

We'll let you know as soon as FreeLedger is ready for you.

In the meantime, follow our progress:
- Twitter: @FreeLedgerApp (https://twitter.com/FreeLedgerApp)
- Website: https://freeledger.dev

— Jesús, founder of FreeLedger

You're receiving this because you signed up for FreeLedger. freeledger.dev`;
}
