import type { Metadata } from "next";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of FreeLedger, the finance dashboard built for freelancers.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" lastUpdated="May 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of FreeLedger. By creating an account or using the service, you
        agree to these Terms. If you do not agree, do not use FreeLedger.
      </p>

      <LegalSection title="The service">
        <p>
          FreeLedger provides financial tracking tools designed for freelancers
          and self-employed individuals: income tracking, expense categorization,
          tax reserve calculation, and dashboard reporting. It is{" "}
          <strong>not financial, tax, or legal advice</strong>. Use the
          information FreeLedger surfaces as a starting point and consult a
          qualified professional for binding decisions.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You are responsible for keeping your credentials secure and for any
          activity that happens under your account. Notify us immediately if
          you suspect unauthorized access. Each individual person is allowed
          one account.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Use FreeLedger for any illegal activity or in violation of applicable laws.</li>
          <li>Attempt to access data belonging to other users.</li>
          <li>
            Abuse, overload, or disrupt the API, including by automated scraping
            or denial-of-service attacks.
          </li>
          <li>
            Reverse engineer, decompile, or attempt to extract source code from
            the service except as permitted by applicable law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Data accuracy">
        <p>
          FreeLedger gives you tools to track and analyze your finances based on
          the data you enter. We make no guarantees about the accuracy of any
          tax calculation, tax reserve, or projection. Tax rules are
          jurisdiction-specific and change over time. Always consult a tax
          professional before filing.
        </p>
      </LegalSection>

      <LegalSection title="Pricing and billing">
        <p>
          A free tier is available. Paid plans are billed monthly or annually,
          and prices are shown in the relevant pricing page at the time of
          purchase. We may change prices with at least 30 days&rsquo; notice
          to existing subscribers; renewals after that date use the new price.
          Refunds are handled case-by-case at our discretion.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You may delete your account at any time from Settings, which removes
          your data permanently. We may suspend or terminate accounts that
          violate these Terms or that pose a security risk to other users. We
          will give reasonable notice when feasible.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          FreeLedger is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;, without warranties of any kind. To the maximum
          extent permitted by law, we are not liable for any indirect,
          incidental, or consequential damages, or for any financial decisions
          you make based on the tools we provide.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of Colombia, without regard to
          conflict-of-laws principles. Any disputes will be resolved in the
          competent courts of Medell&iacute;n, Colombia.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms? Reach out at{" "}
          <a
            href="mailto:jesusdavidgomezcorrea532@gmail.com"
            className="text-emerald-500 underline-offset-4 hover:underline dark:text-emerald-400"
          >
            jesusdavidgomezcorrea532@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
