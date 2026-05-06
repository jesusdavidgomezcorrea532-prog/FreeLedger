import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FreeLedger collects, uses, and protects your data. We never sell your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" lastUpdated="May 2026">
      <p>
        FreeLedger (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a
        finance dashboard built for freelancers. Your trust matters to us, and
        this policy explains in plain language what we collect, what we do with
        it, and the rights you have over your data.
      </p>

      <LegalSection title="What we collect">
        <p>We only collect information you voluntarily provide:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Account information:</strong> your email address and the
            display name you choose.
          </li>
          <li>
            <strong>Financial data:</strong> the income, expenses, clients,
            categories, and tax-related fields you enter into FreeLedger.
          </li>
          <li>
            <strong>Authentication data:</strong> if you sign in with Google
            OAuth, we receive your email and basic profile information from
            Google.
          </li>
        </ul>
        <p>
          We do not collect bank account numbers, credit card numbers, or any
          information from connected financial institutions. FreeLedger is a
          manual tracking tool.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          Your data is used solely to provide and improve the FreeLedger
          service: rendering your dashboards, calculating tax reserves,
          generating CSV exports, and sending you transactional emails (such as
          password resets).
        </p>
        <p>
          <strong>We never sell your data.</strong> We never share your data
          with third parties for marketing or advertising. We do not run any
          ad networks on FreeLedger.
        </p>
      </LegalSection>

      <LegalSection title="Data storage and security">
        <p>
          Your data is stored securely in Supabase, hosted on AWS infrastructure
          in regions chosen for low latency and durability. All connections
          between your browser and our servers are encrypted with TLS, and data
          at rest is encrypted by our hosting providers.
        </p>
        <p>
          Row-Level Security policies ensure that one user&rsquo;s data is never
          visible to another. We follow industry best practices for password
          hashing, session management, and OAuth flows.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use essential cookies only. These are required for authentication
          (keeping you signed in) and to remember your theme preference (light
          or dark). We do not use tracking cookies, advertising cookies, or
          third-party analytics cookies.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Export:</strong> you can download all your income, expenses,
            and client records as CSV from the dashboard at any time.
          </li>
          <li>
            <strong>Deletion:</strong> you can delete your account and all
            associated data from Settings. Deletion is permanent.
          </li>
          <li>
            <strong>Access &amp; correction:</strong> you can edit any of your
            data directly from the dashboard.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy? Reach out at{" "}
          <a
            href="mailto:jesusdavidgomezcorrea532@gmail.com"
            className="text-emerald-500 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            jesusdavidgomezcorrea532@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We&rsquo;ll notify registered users by email of any significant
          changes to this policy at least 14 days before they take effect.
          Minor clarifications and typo fixes may be made without notice.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
