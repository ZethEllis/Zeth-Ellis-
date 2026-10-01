# Career Compass

Next.js 15 (App Router) + Tailwind 4 + Supabase (auth + Postgres) + Vercel.

Flow: quiz → ranked career matches → sign in (magic link) → save a shortlist.
The app runs without Supabase (bundled careers, no sign-in) so you can try it immediately.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase values
npm run dev
```

## Supabase

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/migrations/001_init.sql`.
3. Put the project URL, anon key and service-role key in `.env.local`.
4. `npm run seed` to load the careers.
5. Authentication → URL Configuration: set Site URL to your Vercel URL and add
   `http://localhost:3000/auth/callback` and `https://YOUR-APP.vercel.app/auth/callback` as redirect URLs.

## Vercel

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

Or push to GitHub and import the repo at vercel.com/new, adding the two `NEXT_PUBLIC_*` env vars.
Do **not** add the service-role key to Vercel; it's only for the local seed script.

## Structure

- `src/lib/quiz.ts`, `matching.ts` — questions and the scoring (RIASEC-style interest profile vs. career profiles)
- `src/data/careers.ts` — career data (seed source + fallback)
- `src/lib/supabase/` — browser, server and middleware clients
- `src/app/` — pages: `/`, `/quiz`, `/results`, `/careers/[slug]`, `/login`, `/dashboard`
