-- Lookup tables: the fixed lists of choices (provinces, credentials, price ranges...) that other tables point at.
-- Each one replaces a hard-coded check constraint with a foreign key, so the allowed values live in one table.

create table if not exists public.provinces (
  code text primary key,
  name text not null unique
);

create table if not exists public.cities (
  name text primary key,
  province_code text not null references public.provinces(code)
);

create table if not exists public.school_types (
  type text primary key,
  description text not null
);

create table if not exists public.credentials (
  credential text primary key,
  typical_length text not null
);

create table if not exists public.tuition_ranges (
  id smallint primary key,
  label text not null unique,
  min_amount int not null,
  max_amount int -- null = no upper limit
);

create table if not exists public.industries (
  name text primary key
);

create table if not exists public.company_sizes (
  size text primary key,
  employee_range text not null
);

create table if not exists public.job_levels (
  level text primary key,
  years_experience text not null
);

create table if not exists public.work_settings (
  setting text primary key,
  label text not null
);

create table if not exists public.salary_ranges (
  id smallint primary key,
  label text not null unique,
  min_amount int not null,
  max_amount int -- null = no upper limit
);

create table if not exists public.event_kinds (
  kind text primary key,
  description text not null
);

create table if not exists public.training_levels (
  level smallint primary key,
  label text not null
);

insert into public.provinces (code, name) values
  ('AB', 'Alberta'), ('BC', 'British Columbia'), ('MB', 'Manitoba'), ('NB', 'New Brunswick'),
  ('NL', 'Newfoundland and Labrador'), ('NS', 'Nova Scotia'), ('ON', 'Ontario'), ('PE', 'Prince Edward Island'),
  ('QC', 'Quebec'), ('SK', 'Saskatchewan'), ('NT', 'Northwest Territories'), ('NU', 'Nunavut'), ('YT', 'Yukon');

insert into public.cities (name, province_code) values
  ('Calgary', 'AB'), ('Edmonton', 'AB'), ('Red Deer', 'AB'), ('Vancouver', 'BC'), ('Victoria', 'BC'),
  ('Winnipeg', 'MB'), ('Halifax', 'NS'), ('Toronto', 'ON'), ('Ottawa', 'ON'), ('Montreal', 'QC'),
  ('Saskatoon', 'SK'), ('Regina', 'SK');

insert into public.school_types (type, description) values
  ('university', 'Offers bachelor''s and graduate degrees'),
  ('polytechnic', 'Hands-on diplomas, applied degrees and apprenticeship training'),
  ('college', 'Certificates and diplomas, usually one to two years'),
  ('online', 'Courses taken fully online');

insert into public.credentials (credential, typical_length) values
  ('certificate', '4 to 12 months'),
  ('diploma', '2 years'),
  ('apprenticeship', '4 years, mostly paid on-the-job training'),
  ('degree', '4 years'),
  ('graduate degree', '2 or more years after a degree');

insert into public.tuition_ranges (id, label, min_amount, max_amount) values
  (1, 'Under $5,000', 0, 4999),
  (2, '$5,000 to $7,499', 5000, 7499),
  (3, '$7,500 to $9,999', 7500, 9999),
  (4, '$10,000 to $12,499', 10000, 12499),
  (5, '$12,500 and up', 12500, null);

insert into public.industries (name) values
  ('Business services'), ('Construction'), ('Education'), ('Finance'), ('Health'),
  ('Hospitality'), ('Media'), ('Public service'), ('Science'), ('Technology');

insert into public.company_sizes (size, employee_range) values
  ('small', '1 to 49 employees'), ('medium', '50 to 499 employees'), ('large', '500 or more employees');

insert into public.job_levels (level, years_experience) values
  ('entry', '0 to 2 years'), ('intermediate', '3 to 7 years'), ('senior', '8 or more years');

insert into public.work_settings (setting, label) values
  ('remote', 'From home'), ('office', 'In an office'), ('onsite', 'On site (hospital, shop, school...)'), ('outdoors', 'Outdoors or on the move');

insert into public.salary_ranges (id, label, min_amount, max_amount) values
  (1, 'Under $50,000', 0, 49999),
  (2, '$50,000 to $69,999', 50000, 69999),
  (3, '$70,000 to $89,999', 70000, 89999),
  (4, '$90,000 to $109,999', 90000, 109999),
  (5, '$110,000 and up', 110000, null);

insert into public.event_kinds (kind, description) values
  ('career fair', 'Many employers and schools in one place'),
  ('workshop', 'A hands-on session to build a skill'),
  ('info session', 'A talk about what a career is really like'),
  ('job shadow', 'Spend a day following someone at work');

insert into public.training_levels (level, label) values
  (1, 'Short training (under a year)'), (2, 'College diploma or apprenticeship'), (3, 'University degree or more');

-- Swap the hard-coded check constraints for foreign keys to the lookup tables.
alter table public.schools drop constraint if exists schools_type_check;
alter table public.schools add constraint schools_type_fkey foreign key (type) references public.school_types(type);
alter table public.schools add constraint schools_province_fkey foreign key (province) references public.provinces(code);
alter table public.schools add constraint schools_city_fkey foreign key (city) references public.cities(name);

alter table public.programs drop constraint if exists programs_credential_check;
alter table public.programs add constraint programs_credential_fkey foreign key (credential) references public.credentials(credential);
alter table public.programs add column if not exists tuition_range_id smallint references public.tuition_ranges(id);
update public.programs p set tuition_range_id = r.id from public.tuition_ranges r
  where p.tuition_per_year >= r.min_amount and (r.max_amount is null or p.tuition_per_year <= r.max_amount);
alter table public.programs alter column tuition_range_id set not null;

alter table public.employers drop constraint if exists employers_size_check;
alter table public.employers add constraint employers_size_fkey foreign key (size) references public.company_sizes(size);
alter table public.employers add constraint employers_industry_fkey foreign key (industry) references public.industries(name);
alter table public.employers add constraint employers_province_fkey foreign key (province) references public.provinces(code);
alter table public.employers add constraint employers_city_fkey foreign key (city) references public.cities(name);

alter table public.job_postings drop constraint if exists job_postings_level_check;
alter table public.job_postings drop constraint if exists job_postings_work_setting_check;
alter table public.job_postings add constraint job_postings_level_fkey foreign key (level) references public.job_levels(level);
alter table public.job_postings add constraint job_postings_work_setting_fkey foreign key (work_setting) references public.work_settings(setting);
-- A posting's salary range is the band its midpoint falls in.
alter table public.job_postings add column if not exists salary_range_id smallint references public.salary_ranges(id);
update public.job_postings j set salary_range_id = r.id from public.salary_ranges r
  where (j.salary_min + j.salary_max) / 2 >= r.min_amount and (r.max_amount is null or (j.salary_min + j.salary_max) / 2 <= r.max_amount);
alter table public.job_postings alter column salary_range_id set not null;

alter table public.events drop constraint if exists events_kind_check;
alter table public.events add constraint events_kind_fkey foreign key (kind) references public.event_kinds(kind);
alter table public.events add constraint events_city_fkey foreign key (city) references public.cities(name);

alter table public.careers drop constraint if exists careers_training_level_check;
alter table public.careers add constraint careers_training_level_fkey foreign key (training_level) references public.training_levels(level);

create index if not exists programs_tuition_range_idx on public.programs(tuition_range_id);
create index if not exists job_postings_salary_range_idx on public.job_postings(salary_range_id);

-- Everyone can read the lookup lists; nobody can change them from the app.
do $$
declare t text;
begin
  foreach t in array array['provinces','cities','school_types','credentials','tuition_ranges','industries',
                           'company_sizes','job_levels','work_settings','salary_ranges','event_kinds','training_levels']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%s are public" on public.%I for select using (true)', replace(t, '_', ' '), t);
  end loop;
end $$;
