// Email building blocks. We render plain HTML strings (no React Email) so the
// markup is portable across Gmail, Outlook, Apple Mail and Yahoo without any
// extra runtime dependencies. Layout uses tables on purpose — `flex`/`grid`
// are still unreliable in Outlook 2016+ and Yahoo web.

const EMERALD = "#10b981";
const TEXT = "#18181b";
const MUTED = "#52525b";
const BORDER = "#e4e4e7";
const BG = "#ffffff";
const PAGE_BG = "#f4f4f5";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailLogo(): string {
  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 20px; font-weight: 700; color: ${TEXT}; letter-spacing: -0.01em;">FreeLedger</div>`;
}

export function emailButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;"><tr><td style="background: ${EMERALD}; border-radius: 8px;"><a href="${href}" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">${escapeHtml(label)}</a></td></tr></table>`;
}

export function emailFooter(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px; border-top: 1px solid ${BORDER}; padding-top: 20px;"><tr><td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: ${MUTED}; line-height: 1.5;"><p style="margin: 0 0 6px 0;">You're receiving this because you signed up for FreeLedger.</p><p style="margin: 0;"><a href="https://freeledger.dev" style="color: ${MUTED}; text-decoration: underline;">freeledger.dev</a></p></td></tr></table>`;
}

export interface EmailLayoutOptions {
  preheader?: string;
  body: string;
}

export function emailLayout({ preheader, body }: EmailLayoutOptions): string {
  const preheaderHtml = preheader
    ? `<div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">${escapeHtml(preheader)}</div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>FreeLedger</title>
  </head>
  <body style="margin: 0; padding: 0; background: ${PAGE_BG}; color: ${TEXT};">
    ${preheaderHtml}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${PAGE_BG};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: ${BG}; border-radius: 12px; border: 1px solid ${BORDER};">
            <tr>
              <td style="padding: 32px 32px 8px 32px;">
                ${emailLogo()}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 32px 32px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: ${TEXT};">
                ${body}
                ${emailFooter()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
