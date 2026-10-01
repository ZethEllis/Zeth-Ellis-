-- Careers: public, read-only to clients (written via service role / seed script)
create table if not exists public.careers (
  slug text primary key,
  title text not null,
  summary text not null,
  salary_range text not null,
  education text not null,
  outlook text not null,
  training_level smallint not null check (training_level between 1 and 3),
  riasec jsonb not null,
  skills text[] not null default '{}'
);

-- A user's quiz results (answers encoded like "345123451234-2")
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  created_at timestamptz not null default now()
);

-- Careers a user has shortlisted
create table if not exists public.saved_careers (
  user_id uuid not null references auth.users(id) on delete cascade,
  career_slug text not null references public.careers(slug) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, career_slug)
);

alter table public.careers enable row level security;
alter table public.quiz_results enable row level security;
alter table public.saved_careers enable row level security;

create policy "careers are public" on public.careers for select using (true);

create policy "own results: select" on public.quiz_results for select using (auth.uid() = user_id);
create policy "own results: insert" on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "own results: delete" on public.quiz_results for delete using (auth.uid() = user_id);

create policy "own saves: select" on public.saved_careers for select using (auth.uid() = user_id);
create policy "own saves: insert" on public.saved_careers for insert with check (auth.uid() = user_id);
create policy "own saves: delete" on public.saved_careers for delete using (auth.uid() = user_id);
