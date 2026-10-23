-- Sample data: schools, programs, employers, job postings, career stories and events.
-- Everything here is fictional and made up for demonstrating the sandbox.

create table if not exists public.schools (
  id serial primary key,
  name text not null unique,
  type text not null check (type in ('university','polytechnic','college','online')),
  city text not null,
  province text not null
);

create table if not exists public.programs (
  id serial primary key,
  school_id int not null references public.schools(id) on delete cascade,
  career_slug text not null references public.careers(slug) on delete cascade,
  name text not null,
  credential text not null check (credential in ('certificate','diploma','apprenticeship','degree','graduate degree')),
  length_months int not null,
  tuition_per_year int not null
);

create table if not exists public.employers (
  id serial primary key,
  name text not null unique,
  industry text not null,
  city text not null,
  province text not null,
  size text not null check (size in ('small','medium','large'))
);

create table if not exists public.job_postings (
  id serial primary key,
  employer_id int not null references public.employers(id) on delete cascade,
  career_slug text not null references public.careers(slug) on delete cascade,
  title text not null,
  level text not null check (level in ('entry','intermediate','senior')),
  work_setting text not null check (work_setting in ('remote','office','onsite','outdoors')),
  salary_min int not null,
  salary_max int not null,
  posted_on date not null
);

create table if not exists public.career_stories (
  id serial primary key,
  career_slug text not null references public.careers(slug) on delete cascade,
  person_name text not null,
  years_experience int not null,
  story text not null
);

create table if not exists public.events (
  id serial primary key,
  title text not null,
  kind text not null check (kind in ('career fair','workshop','info session','job shadow')),
  city text not null,
  starts_on date not null,
  career_slug text references public.careers(slug) on delete set null
);

create index if not exists programs_career_idx on public.programs(career_slug);
create index if not exists programs_school_idx on public.programs(school_id);
create index if not exists job_postings_career_idx on public.job_postings(career_slug);
create index if not exists job_postings_employer_idx on public.job_postings(employer_id);
create index if not exists career_stories_career_idx on public.career_stories(career_slug);
create index if not exists events_career_idx on public.events(career_slug);

alter table public.schools enable row level security;
alter table public.programs enable row level security;
alter table public.employers enable row level security;
alter table public.job_postings enable row level security;
alter table public.career_stories enable row level security;
alter table public.events enable row level security;

create policy "schools are public" on public.schools for select using (true);
create policy "programs are public" on public.programs for select using (true);
create policy "employers are public" on public.employers for select using (true);
create policy "job postings are public" on public.job_postings for select using (true);
create policy "career stories are public" on public.career_stories for select using (true);
create policy "events are public" on public.events for select using (true);


insert into public.schools (id, name, type, city, province) values
  (1, 'Prairie Ridge University', 'university', 'Calgary', 'AB'),
  (2, 'Bow Valley Polytechnic', 'polytechnic', 'Calgary', 'AB'),
  (3, 'Northern Lights College', 'college', 'Edmonton', 'AB'),
  (4, 'Coastal Pacific University', 'university', 'Vancouver', 'BC'),
  (5, 'Lakeshore Institute of Technology', 'polytechnic', 'Toronto', 'ON'),
  (6, 'Red River Community College', 'college', 'Winnipeg', 'MB'),
  (7, 'Atlantic Harbour University', 'university', 'Halifax', 'NS'),
  (8, 'Maple Online Academy', 'online', 'Ottawa', 'ON');

insert into public.employers (id, name, industry, city, province, size) values
  (1, 'Chinook Health Network', 'Health', 'Saskatoon', 'SK', 'medium'),
  (2, 'Summit Ledger Partners', 'Finance', 'Halifax', 'NS', 'large'),
  (3, 'Bright Pixel Studios', 'Media', 'Edmonton', 'AB', 'large'),
  (4, 'Northstar Software', 'Technology', 'Saskatoon', 'SK', 'large'),
  (5, 'Foothills Builders Co.', 'Construction', 'Ottawa', 'ON', 'small'),
  (6, 'Riverbend School Division', 'Education', 'Saskatoon', 'SK', 'medium'),
  (7, 'Aurora Data Labs', 'Technology', 'Calgary', 'AB', 'large'),
  (8, 'Parkland Community Services', 'Public service', 'Ottawa', 'ON', 'large'),
  (9, 'Crestline Engineering', 'Construction', 'Calgary', 'AB', 'small'),
  (10, 'Wildrose Veterinary Clinics', 'Health', 'Saskatoon', 'SK', 'large'),
  (11, 'Harbourview Legal LLP', 'Finance', 'Calgary', 'AB', 'small'),
  (12, 'Greenfield Environmental', 'Science', 'Toronto', 'ON', 'large'),
  (13, 'Copper Kettle Restaurant Group', 'Hospitality', 'Calgary', 'AB', 'medium'),
  (14, 'Pinecone Marketing', 'Business services', 'Calgary', 'AB', 'medium'),
  (15, 'Glacier Research Institute', 'Science', 'Ottawa', 'ON', 'large'),
  (16, 'City Safety Services', 'Public service', 'Winnipeg', 'MB', 'large'),
  (17, 'Keystone Realty', 'Business services', 'Toronto', 'ON', 'large'),
  (18, 'Mosaic People Solutions', 'Business services', 'Calgary', 'AB', 'large');

insert into public.programs (school_id, career_slug, name, credential, length_months, tuition_per_year) values
  (7, 'accountant', 'Bachelor''s Program for Accountants', 'degree', 48, 9200),
  (2, 'accountant', 'Accountant Diploma', 'diploma', 24, 7800),
  (5, 'carpenter', 'Carpenter Apprenticeship', 'apprenticeship', 48, 4400),
  (6, 'carpenter', 'Carpenter Certificate', 'certificate', 8, 6100),
  (8, 'chef', 'Chef Certificate', 'certificate', 4, 6000),
  (3, 'chef', 'Chef Certificate', 'certificate', 6, 6500),
  (4, 'civil-engineer', 'Bachelor''s Program for Civil Engineers', 'degree', 48, 8900),
  (5, 'civil-engineer', 'Civil Engineer Diploma', 'diploma', 24, 8300),
  (2, 'cybersecurity-analyst', 'Cybersecurity Analyst Diploma', 'diploma', 24, 8100),
  (8, 'cybersecurity-analyst', 'Cybersecurity Analyst Certificate', 'certificate', 10, 6300),
  (8, 'data-analyst', 'Data Analyst Certificate', 'certificate', 10, 7300),
  (3, 'data-analyst', 'Data Analyst Diploma', 'diploma', 24, 7000),
  (5, 'dental-hygienist', 'Dental Hygienist Diploma', 'diploma', 24, 9100),
  (6, 'dental-hygienist', 'Dental Hygienist Diploma', 'diploma', 24, 8400),
  (8, 'early-childhood-educator', 'Early Childhood Educator Certificate', 'certificate', 10, 7400),
  (6, 'early-childhood-educator', 'Early Childhood Educator Diploma', 'diploma', 24, 8600),
  (2, 'electrician', 'Electrician Apprenticeship', 'apprenticeship', 48, 2900),
  (3, 'electrician', 'Electrician Certificate', 'certificate', 8, 5700),
  (8, 'entrepreneur', 'Founder Certificate', 'certificate', 4, 5800),
  (3, 'entrepreneur', 'Founder Certificate', 'certificate', 6, 5800),
  (8, 'environmental-technician', 'Environmental Technician Certificate', 'certificate', 10, 7500),
  (5, 'environmental-technician', 'Environmental Technician Diploma', 'diploma', 24, 8400),
  (5, 'graphic-designer', 'Graphic Designer Diploma', 'diploma', 24, 7900),
  (8, 'graphic-designer', 'Graphic Designer Certificate', 'certificate', 10, 7100),
  (2, 'hr-specialist', 'HR Specialist Diploma', 'diploma', 24, 8400),
  (3, 'hr-specialist', 'HR Specialist Diploma', 'diploma', 24, 8600),
  (3, 'it-support', 'IT Support Technician Certificate', 'certificate', 6, 5800),
  (8, 'it-support', 'IT Support Technician Certificate', 'certificate', 4, 6400),
  (4, 'lawyer', 'Bachelor''s Program for Associate Lawyers', 'degree', 48, 10000),
  (4, 'lawyer', 'Professional Program for Associate Lawyers', 'graduate degree', 24, 13100),
  (2, 'marketing-manager', 'Marketing Manager Diploma', 'diploma', 24, 8000),
  (4, 'marketing-manager', 'Bachelor''s Program for Marketing Managers', 'degree', 48, 9700),
  (3, 'paramedic', 'Paramedic Diploma', 'diploma', 24, 9100),
  (5, 'paramedic', 'Paramedic Diploma', 'diploma', 24, 8800),
  (7, 'pharmacist', 'Bachelor''s Program for Pharmacists', 'degree', 48, 9400),
  (1, 'pharmacist', 'Professional Program for Pharmacists', 'graduate degree', 24, 13000),
  (1, 'physiotherapist', 'Professional Program for Physiotherapists', 'graduate degree', 24, 14800),
  (1, 'physiotherapist', 'Bachelor''s Program for Physiotherapists', 'degree', 48, 8500),
  (6, 'plumber', 'Plumber Certificate', 'certificate', 8, 6200),
  (2, 'plumber', 'Plumber Apprenticeship', 'apprenticeship', 48, 3000),
  (5, 'police-officer', 'Police Constable Diploma', 'diploma', 24, 9200),
  (3, 'police-officer', 'Police Constable Diploma', 'diploma', 24, 7700),
  (8, 'real-estate-agent', 'Real Estate Agent Certificate', 'certificate', 4, 7800),
  (3, 'real-estate-agent', 'Real Estate Agent Certificate', 'certificate', 6, 7700),
  (1, 'registered-nurse', 'Bachelor''s Program for Registered Nurses', 'degree', 48, 8500),
  (2, 'registered-nurse', 'Registered Nurse Diploma', 'diploma', 24, 7300),
  (4, 'research-scientist', 'Bachelor''s Program for Research Scientists', 'degree', 48, 10200),
  (4, 'research-scientist', 'Professional Program for Research Scientists', 'graduate degree', 24, 13800),
  (7, 'social-worker', 'Bachelor''s Program for Social Workers', 'degree', 48, 10700),
  (4, 'social-worker', 'Professional Program for Social Workers', 'graduate degree', 24, 14300),
  (2, 'software-developer', 'Software Developer Diploma', 'diploma', 24, 8200),
  (6, 'software-developer', 'Software Developer Diploma', 'diploma', 24, 7200),
  (7, 'teacher', 'Bachelor''s Program for Teachers', 'degree', 48, 8900),
  (2, 'teacher', 'Teacher Diploma', 'diploma', 24, 8100),
  (6, 'ux-designer', 'UX Designer Diploma', 'diploma', 24, 7300),
  (5, 'ux-designer', 'UX Designer Diploma', 'diploma', 24, 8400),
  (2, 'veterinary-technician', 'Veterinary Technician Diploma', 'diploma', 24, 9300),
  (6, 'veterinary-technician', 'Veterinary Technician Diploma', 'diploma', 24, 8800),
  (2, 'video-producer', 'Video Producer Diploma', 'diploma', 24, 7300),
  (6, 'video-producer', 'Video Producer Diploma', 'diploma', 24, 8100);

insert into public.job_postings (employer_id, career_slug, title, level, work_setting, salary_min, salary_max, posted_on) values
  (2, 'accountant', 'Junior Accountant', 'entry', 'office', 71000, 79000, '2026-10-16'),
  (11, 'accountant', 'Accountant', 'intermediate', 'remote', 91000, 103000, '2026-10-06'),
  (2, 'accountant', 'Senior Accountant', 'senior', 'remote', 115000, 125000, '2026-10-15'),
  (5, 'carpenter', 'Junior Carpenter', 'entry', 'outdoors', 60000, 70000, '2026-10-03'),
  (9, 'carpenter', 'Carpenter', 'intermediate', 'onsite', 65000, 75000, '2026-10-04'),
  (9, 'carpenter', 'Senior Carpenter', 'senior', 'onsite', 99000, 111000, '2026-09-08'),
  (13, 'chef', 'Junior Chef', 'entry', 'onsite', 44000, 52000, '2026-09-20'),
  (13, 'chef', 'Chef', 'intermediate', 'onsite', 56000, 71000, '2026-09-19'),
  (13, 'chef', 'Senior Chef', 'senior', 'onsite', 64000, 79000, '2026-09-18'),
  (5, 'civil-engineer', 'Junior Civil Engineer', 'entry', 'outdoors', 67000, 77000, '2026-10-13'),
  (9, 'civil-engineer', 'Civil Engineer', 'intermediate', 'outdoors', 97000, 107000, '2026-10-09'),
  (5, 'civil-engineer', 'Senior Civil Engineer', 'senior', 'outdoors', 130000, 138000, '2026-10-11'),
  (4, 'cybersecurity-analyst', 'Junior Cybersecurity Analyst', 'entry', 'remote', 53000, 63000, '2026-10-17'),
  (4, 'cybersecurity-analyst', 'Cybersecurity Analyst', 'intermediate', 'remote', 69000, 79000, '2026-09-27'),
  (4, 'cybersecurity-analyst', 'Senior Cybersecurity Analyst', 'senior', 'office', 93000, 108000, '2026-09-18'),
  (7, 'data-analyst', 'Junior Data Analyst', 'entry', 'office', 58000, 73000, '2026-10-05'),
  (4, 'data-analyst', 'Data Analyst', 'intermediate', 'remote', 68000, 83000, '2026-09-14'),
  (7, 'data-analyst', 'Senior Data Analyst', 'senior', 'remote', 101000, 113000, '2026-10-16'),
  (10, 'dental-hygienist', 'Junior Dental Hygienist', 'entry', 'onsite', 50000, 60000, '2026-10-21'),
  (1, 'dental-hygienist', 'Dental Hygienist', 'intermediate', 'onsite', 69000, 81000, '2026-09-30'),
  (1, 'dental-hygienist', 'Senior Dental Hygienist', 'senior', 'onsite', 91000, 99000, '2026-09-12'),
  (6, 'early-childhood-educator', 'Junior Early Childhood Educator', 'entry', 'onsite', 51000, 61000, '2026-10-06'),
  (6, 'early-childhood-educator', 'Early Childhood Educator', 'intermediate', 'onsite', 76000, 84000, '2026-09-24'),
  (6, 'early-childhood-educator', 'Senior Early Childhood Educator', 'senior', 'onsite', 102000, 110000, '2026-10-12'),
  (9, 'electrician', 'Junior Electrician', 'entry', 'onsite', 55000, 63000, '2026-10-21'),
  (9, 'electrician', 'Electrician', 'intermediate', 'onsite', 75000, 87000, '2026-10-11'),
  (5, 'electrician', 'Senior Electrician', 'senior', 'outdoors', 86000, 101000, '2026-10-22'),
  (18, 'entrepreneur', 'Junior Founder', 'entry', 'office', 41000, 53000, '2026-09-15'),
  (14, 'entrepreneur', 'Founder', 'intermediate', 'onsite', 49000, 59000, '2026-09-28'),
  (18, 'entrepreneur', 'Senior Founder', 'senior', 'onsite', 76000, 86000, '2026-10-06'),
  (12, 'environmental-technician', 'Junior Environmental Technician', 'entry', 'office', 56000, 66000, '2026-10-06'),
  (12, 'environmental-technician', 'Environmental Technician', 'intermediate', 'outdoors', 68000, 83000, '2026-09-23'),
  (12, 'environmental-technician', 'Senior Environmental Technician', 'senior', 'outdoors', 101000, 109000, '2026-10-05'),
  (3, 'graphic-designer', 'Junior Graphic Designer', 'entry', 'office', 51000, 63000, '2026-10-22'),
  (3, 'graphic-designer', 'Graphic Designer', 'intermediate', 'remote', 75000, 87000, '2026-10-01'),
  (3, 'graphic-designer', 'Senior Graphic Designer', 'senior', 'remote', 101000, 109000, '2026-09-08'),
  (14, 'hr-specialist', 'Junior HR Specialist', 'entry', 'remote', 56000, 64000, '2026-09-17'),
  (14, 'hr-specialist', 'HR Specialist', 'intermediate', 'remote', 68000, 83000, '2026-10-21'),
  (18, 'hr-specialist', 'Senior HR Specialist', 'senior', 'remote', 84000, 99000, '2026-10-01'),
  (4, 'it-support', 'Junior IT Support Technician', 'entry', 'office', 41000, 51000, '2026-09-13'),
  (7, 'it-support', 'IT Support Technician', 'intermediate', 'remote', 55000, 63000, '2026-09-09'),
  (4, 'it-support', 'Senior IT Support Technician', 'senior', 'remote', 71000, 81000, '2026-10-22'),
  (2, 'lawyer', 'Junior Associate Lawyer', 'entry', 'office', 69000, 79000, '2026-10-13'),
  (11, 'lawyer', 'Associate Lawyer', 'intermediate', 'office', 85000, 95000, '2026-10-05'),
  (11, 'lawyer', 'Senior Associate Lawyer', 'senior', 'office', 129000, 137000, '2026-10-23'),
  (14, 'marketing-manager', 'Junior Marketing Manager', 'entry', 'office', 78000, 86000, '2026-09-24'),
  (17, 'marketing-manager', 'Marketing Manager', 'intermediate', 'remote', 86000, 96000, '2026-09-26'),
  (14, 'marketing-manager', 'Senior Marketing Manager', 'senior', 'office', 124000, 132000, '2026-09-08'),
  (10, 'paramedic', 'Junior Paramedic', 'entry', 'outdoors', 59000, 69000, '2026-09-20'),
  (10, 'paramedic', 'Paramedic', 'intermediate', 'outdoors', 74000, 82000, '2026-10-20'),
  (10, 'paramedic', 'Senior Paramedic', 'senior', 'onsite', 100000, 108000, '2026-10-03'),
  (10, 'pharmacist', 'Junior Pharmacist', 'entry', 'onsite', 74000, 86000, '2026-10-07'),
  (1, 'pharmacist', 'Pharmacist', 'intermediate', 'onsite', 97000, 112000, '2026-10-14'),
  (1, 'pharmacist', 'Senior Pharmacist', 'senior', 'onsite', 124000, 132000, '2026-09-14'),
  (10, 'physiotherapist', 'Junior Physiotherapist', 'entry', 'onsite', 71000, 83000, '2026-09-20'),
  (1, 'physiotherapist', 'Physiotherapist', 'intermediate', 'onsite', 91000, 99000, '2026-10-11'),
  (10, 'physiotherapist', 'Senior Physiotherapist', 'senior', 'onsite', 126000, 141000, '2026-10-13'),
  (9, 'plumber', 'Junior Plumber', 'entry', 'outdoors', 50000, 62000, '2026-10-12'),
  (5, 'plumber', 'Plumber', 'intermediate', 'onsite', 71000, 79000, '2026-09-16'),
  (5, 'plumber', 'Senior Plumber', 'senior', 'onsite', 89000, 99000, '2026-10-11'),
  (8, 'police-officer', 'Junior Police Constable', 'entry', 'onsite', 60000, 68000, '2026-09-24'),
  (8, 'police-officer', 'Police Constable', 'intermediate', 'outdoors', 64000, 79000, '2026-09-11'),
  (16, 'police-officer', 'Senior Police Constable', 'senior', 'onsite', 93000, 101000, '2026-10-07'),
  (14, 'real-estate-agent', 'Junior Real Estate Agent', 'entry', 'outdoors', 40000, 55000, '2026-09-16'),
  (18, 'real-estate-agent', 'Real Estate Agent', 'intermediate', 'office', 49000, 59000, '2026-10-06'),
  (17, 'real-estate-agent', 'Senior Real Estate Agent', 'senior', 'office', 75000, 87000, '2026-10-17'),
  (10, 'registered-nurse', 'Junior Registered Nurse', 'entry', 'onsite', 76000, 84000, '2026-09-16'),
  (10, 'registered-nurse', 'Registered Nurse', 'intermediate', 'onsite', 95000, 110000, '2026-09-18'),
  (1, 'registered-nurse', 'Senior Registered Nurse', 'senior', 'onsite', 123000, 131000, '2026-10-08'),
  (15, 'research-scientist', 'Junior Research Scientist', 'entry', 'office', 79000, 87000, '2026-10-18'),
  (15, 'research-scientist', 'Research Scientist', 'intermediate', 'onsite', 97000, 109000, '2026-09-26'),
  (15, 'research-scientist', 'Senior Research Scientist', 'senior', 'onsite', 131000, 139000, '2026-09-10'),
  (8, 'social-worker', 'Junior Social Worker', 'entry', 'onsite', 74000, 84000, '2026-09-23'),
  (16, 'social-worker', 'Social Worker', 'intermediate', 'office', 101000, 109000, '2026-09-15'),
  (16, 'social-worker', 'Senior Social Worker', 'senior', 'office', 111000, 126000, '2026-10-05'),
  (7, 'software-developer', 'Junior Software Developer', 'entry', 'remote', 59000, 71000, '2026-10-04'),
  (7, 'software-developer', 'Software Developer', 'intermediate', 'remote', 76000, 88000, '2026-10-02'),
  (4, 'software-developer', 'Senior Software Developer', 'senior', 'office', 88000, 96000, '2026-10-14'),
  (6, 'teacher', 'Junior Teacher', 'entry', 'onsite', 75000, 83000, '2026-09-17'),
  (6, 'teacher', 'Teacher', 'intermediate', 'onsite', 95000, 110000, '2026-10-01'),
  (6, 'teacher', 'Senior Teacher', 'senior', 'onsite', 112000, 124000, '2026-10-16'),
  (7, 'ux-designer', 'Junior UX Designer', 'entry', 'office', 59000, 74000, '2026-10-05'),
  (7, 'ux-designer', 'UX Designer', 'intermediate', 'remote', 75000, 87000, '2026-09-28'),
  (4, 'ux-designer', 'Senior UX Designer', 'senior', 'office', 85000, 93000, '2026-10-01'),
  (1, 'veterinary-technician', 'Junior Veterinary Technician', 'entry', 'onsite', 49000, 64000, '2026-09-19'),
  (10, 'veterinary-technician', 'Veterinary Technician', 'intermediate', 'onsite', 65000, 77000, '2026-09-14'),
  (1, 'veterinary-technician', 'Senior Veterinary Technician', 'senior', 'onsite', 86000, 94000, '2026-10-15'),
  (3, 'video-producer', 'Junior Video Producer', 'entry', 'remote', 54000, 64000, '2026-09-19'),
  (3, 'video-producer', 'Video Producer', 'intermediate', 'remote', 72000, 87000, '2026-09-11'),
  (3, 'video-producer', 'Senior Video Producer', 'senior', 'outdoors', 96000, 108000, '2026-09-21');

insert into public.career_stories (career_slug, person_name, years_experience, story) values
  ('accountant', 'Maya Bouchard', 9, 'I''ve been an accountant for 9 years. What surprised me most was the variety of problems. If you''re thinking about it, be ready for keeping up with new rules and tools.'),
  ('carpenter', 'Jordan Bouchard', 9, 'I started as a carpenter after trying a few other things. The best part is seeing the results of my work. The hardest part is staying calm when things go wrong.'),
  ('chef', 'Priya Tremblay', 16, 'I''ve been a chef for 16 years. What surprised me most was the flexibility in my schedule. If you''re thinking about it, be ready for the busy seasons.'),
  ('civil-engineer', 'Liam Lee', 12, 'I started as a civil engineer after trying a few other things. The best part is working with a great team. The hardest part is the pressure of deadlines.'),
  ('cybersecurity-analyst', 'Aisha Martin', 15, 'I''ve been a cybersecurity analyst for 15 years. What surprised me most was seeing the results of my work. If you''re thinking about it, be ready for the paperwork.'),
  ('data-analyst', 'Noah Haddad', 4, 'I''ve been a data analyst for 4 years. What surprised me most was building things that last. If you''re thinking about it, be ready for long shifts sometimes.'),
  ('dental-hygienist', 'Sofia Singh', 9, 'I''ve been a dental hygienist for 9 years. What surprised me most was the people I get to help. If you''re thinking about it, be ready for keeping up with new rules and tools.'),
  ('early-childhood-educator', 'Ethan Fraser', 2, 'I''ve been an early childhood educator for 2 years. What surprised me most was the flexibility in my schedule. If you''re thinking about it, be ready for the paperwork.'),
  ('electrician', 'Hana Haddad', 8, 'I started as an electrician after trying a few other things. The best part is building things that last. The hardest part is the early starts.'),
  ('entrepreneur', 'Lucas Martin', 5, 'I started as a founder after trying a few other things. The best part is building things that last. The hardest part is the pressure of deadlines.'),
  ('environmental-technician', 'Amara Tremblay', 17, 'I started as an environmental technician after trying a few other things. The best part is seeing the results of my work. The hardest part is the pressure of deadlines.'),
  ('graphic-designer', 'Owen Singh', 15, 'Every day as a graphic designer is a bit different. I love working with a great team, but the paperwork took some getting used to.'),
  ('hr-specialist', 'Zara Lee', 14, 'I''ve been an HR specialist for 14 years. What surprised me most was building things that last. If you''re thinking about it, be ready for staying calm when things go wrong.'),
  ('it-support', 'Mateo Singh', 3, 'Every day as an IT support technician is a bit different. I love learning something new every week, but the pressure of deadlines took some getting used to.'),
  ('lawyer', 'Chloe Silva', 11, 'I''ve been an associate lawyer for 11 years. What surprised me most was the variety of problems. If you''re thinking about it, be ready for the paperwork.'),
  ('marketing-manager', 'Kai Chen', 3, 'I started as a marketing manager after trying a few other things. The best part is learning something new every week. The hardest part is keeping up with new rules and tools.'),
  ('paramedic', 'Nadia Chen', 12, 'I''ve been a paramedic for 12 years. What surprised me most was the variety of problems. If you''re thinking about it, be ready for long shifts sometimes.'),
  ('pharmacist', 'Ben Haddad', 16, 'I''ve been a pharmacist for 16 years. What surprised me most was being trusted to make decisions. If you''re thinking about it, be ready for the busy seasons.'),
  ('physiotherapist', 'Leila Haddad', 7, 'I''ve been a physiotherapist for 7 years. What surprised me most was being trusted to make decisions. If you''re thinking about it, be ready for staying calm when things go wrong.'),
  ('plumber', 'Ryan MacLeod', 17, 'I started as a plumber after trying a few other things. The best part is building things that last. The hardest part is the busy seasons.'),
  ('police-officer', 'Grace Okafor', 2, 'I''ve been a police constable for 2 years. What surprised me most was the flexibility in my schedule. If you''re thinking about it, be ready for the pressure of deadlines.'),
  ('real-estate-agent', 'Omar Tremblay', 4, 'Every day as a real estate agent is a bit different. I love the variety of problems, but keeping up with new rules and tools took some getting used to.'),
  ('registered-nurse', 'Ivy Roy', 14, 'Every day as a registered nurse is a bit different. I love seeing the results of my work, but keeping up with new rules and tools took some getting used to.'),
  ('research-scientist', 'Daniel Roy', 16, 'I''ve been a research scientist for 16 years. What surprised me most was learning something new every week. If you''re thinking about it, be ready for keeping up with new rules and tools.'),
  ('social-worker', 'Mei Bouchard', 16, 'Every day as a social worker is a bit different. I love the people I get to help, but the busy seasons took some getting used to.'),
  ('software-developer', 'Tyler Bouchard', 8, 'I started as a software developer after trying a few other things. The best part is learning something new every week. The hardest part is the early starts.'),
  ('teacher', 'Ava Chen', 8, 'I''ve been a teacher for 8 years. What surprised me most was the people I get to help. If you''re thinking about it, be ready for the pressure of deadlines.'),
  ('ux-designer', 'Samir Roy', 9, 'Every day as a UX designer is a bit different. I love building things that last, but keeping up with new rules and tools took some getting used to.'),
  ('veterinary-technician', 'Elena Singh', 15, 'I started as a veterinary technician after trying a few other things. The best part is the flexibility in my schedule. The hardest part is keeping up with new rules and tools.'),
  ('video-producer', 'Jonah Lee', 11, 'Every day as a video producer is a bit different. I love seeing the results of my work, but the paperwork took some getting used to.');

insert into public.events (title, kind, city, starts_on, career_slug) values
  ('Fall Career Fair', 'career fair', 'Vancouver', '2026-11-12', null),
  ('Tech Careers Night', 'info session', 'Edmonton', '2027-02-27', 'software-developer'),
  ('Try the Trades Day', 'workshop', 'Ottawa', '2027-02-19', 'electrician'),
  ('Healthcare Job Shadow', 'job shadow', 'Halifax', '2026-12-03', 'registered-nurse'),
  ('Design Portfolio Workshop', 'workshop', 'Ottawa', '2026-12-19', 'graphic-designer'),
  ('Start Your Own Business', 'workshop', 'Edmonton', '2027-02-16', 'entrepreneur'),
  ('Spring Career Fair', 'career fair', 'Winnipeg', '2027-03-18', null),
  ('Life as a Paramedic', 'info session', 'Edmonton', '2027-03-09', 'paramedic'),
  ('Data Skills Bootcamp', 'workshop', 'Ottawa', '2027-03-10', 'data-analyst'),
  ('A Day in a Law Office', 'job shadow', 'Vancouver', '2027-02-01', 'lawyer'),
  ('Green Jobs Expo', 'career fair', 'Edmonton', '2027-01-11', 'environmental-technician'),
  ('Teaching Careers Info Night', 'info session', 'Vancouver', '2027-02-10', 'teacher');

-- Keep the id sequences past the explicit ids used above.
select setval('public.schools_id_seq', (select max(id) from public.schools));
select setval('public.employers_id_seq', (select max(id) from public.employers));
