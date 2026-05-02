# FreeLedger

> Know your real money.

The finance dashboard built for freelancers. Track income by client, separate business from personal expenses, calculate your tax reserve, and finally answer: how much money do I actually have?

**Status:** In development — launching May 2026.
**Site:** [freeledger.dev](https://freeledger.dev)

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) (auth + database)
- [Recharts](https://recharts.org/) for visualizations
- [Resend](https://resend.com/) for transactional email
- [lucide-react](https://lucide.dev/) for icons

## Getting started

```bash
git clone https://github.com/jesusdavidgomezcorrea532-prog/FreeLedger.git
cd FreeLedger
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000 to see the landing page.

## Supabase setup

The waitlist form requires a `waitlist` table:

```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Project structure

```
src/
├── app/
│   ├── (auth)/        — login, signup (placeholders)
│   ├── (dashboard)/   — authenticated dashboard (placeholder)
│   ├── layout.tsx     — root layout, fonts, metadata, Toaster
│   └── page.tsx       — landing page
├── components/
│   ├── landing/       — hero, problem, features, waitlist-form, footer
│   ├── shared/        — reusable cross-app components (Logo)
│   └── ui/            — shadcn primitives
├── lib/
│   ├── actions/       — Server Actions
│   ├── supabase/      — browser + server clients
│   └── utils.ts       — shadcn helpers
└── types/             — shared TypeScript types
```

## License

Built by [JDA! Apps](https://jdaapps.dev). All rights reserved.
