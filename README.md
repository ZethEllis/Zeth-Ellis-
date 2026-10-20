# Career E-Sandbox

Next.js 15 (App Router) + Tailwind 4 + Supabase (auth + Postgres) + Vercel.

Flow: optional quiz (interests + work style) → sandbox where you adjust sliders, filter by where you want to work,
and see ranked matches with their reasons → compare careers side by side → sign in (magic link) → save a shortlist.
The app runs without Supabase (bundled careers, no sign-in) so you can try it immediately.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase values
npm run dev
```

## Supabase

1. Create a project at supabase.com.
2. SQL Editor → run the files in `supabase/migrations/` in order (`001`, `002`, `003`).
3. Put the project URL, anon key and service-role key in `.env.local`.
4. `npm run seed` to load the careers (re-run it whenever `src/data/careers.ts` changes).
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

- `src/lib/quiz.ts`, `matching.ts` — quiz questions and turning answers into a starting scenario
- `src/lib/sandbox.ts` — scoring across the three lenses, the reasons shown on each card, and the work-setting filter
- `src/data/careers.ts` — career data (seed source + fallback)
- `src/lib/supabase/` — browser, server and middleware clients
- `src/app/` — pages: `/`, `/sandbox`, `/quiz`, `/compare`, `/careers/[slug]`, `/login`, `/dashboard` (`/results` redirects to `/sandbox`)
