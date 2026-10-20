-- Where each career's work usually happens (remote / office / onsite / outdoors), used by the sandbox's setting filter.
alter table public.careers add column if not exists work_settings text[] not null default '{}';
-- Then re-run `npm run seed` to fill the new column and load the added careers.
