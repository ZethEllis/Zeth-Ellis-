-- Adds the work-preference profile and outlook score used by the sandbox's workstyle/practical lenses.
alter table public.careers add column if not exists prefs jsonb;
alter table public.careers add column if not exists outlook_score real not null default 0.5;
-- Then re-run `npm run seed` to fill the new columns.
