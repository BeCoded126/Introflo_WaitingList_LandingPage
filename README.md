# introflo.io — MVP Starter

This repository is a scaffold for the IntroFlo MVP.

Stack

- Next.js 15 (App Router) + TypeScript
- Prisma ORM (Postgres / Supabase)
- Supabase Auth (magic link + Google OAuth)
- Stripe, Resend, PostHog, Sentry (stubs)

Getting started

1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migration (requires DATABASE_URL):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run dev server:

```bash
npm run dev
```

What's included

- `prisma/schema.prisma` — initial DB schema for orgs, users, facilities, services, matches, referrals, interactions, leads, subscriptions, audit logs.
- `.env.example` — environment variables placeholders
- `next.config.js` and `tsconfig.json`

Roadmap (first 4 weeks)

- Week 1: Auth, DB, schema, onboarding flow
- Week 2: Facility directory, filters, search
- Week 3: Matching algorithm, match UX, 48-hour chat window
- Week 4: Verifications, basic billing (Stripe), analytics

Notes

- Do NOT store PHI. Only business contact and facility metadata.
- Follow brand guidelines (colors and fonts) in UI work.

Next steps

- Configure Supabase project and update `.env.local`
- Implement auth and RBAC policies
- Wire up Prisma to Supabase Postgres
