import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "FreeLedger — Know your real money",
    template: "%s · FreeLedger",
  },
  description:
    "The finance dashboard built for freelancers. Track income by client, expenses, tax reserves, and see what you actually keep.",
  applicationName: "FreeLedger",
  keywords: [
    "freelancer finance",
    "income tracking",
    "tax reserve",
    "freelance accounting",
    "self-employed dashboard",
  ],
  authors: [{ name: "JDA! Apps" }],
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "FreeLedger — Know your real money",
    description:
      "Track income by client, separate business from personal expenses, and see what you actually keep after taxes.",
    siteName: "FreeLedger",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeLedger — Know your real money",
    description:
      "The finance dashboard built for freelancers.",
    creator: "@FreeLedgerApp",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
