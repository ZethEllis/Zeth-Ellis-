-- Trim the schema back to the tables the app actually reads and writes:
-- careers, quiz_results and saved_careers. The sample tables from 004 (and the
-- lookup tables that were tried on top of them) are not used by any page.

alter table public.careers drop constraint if exists careers_training_level_fkey;
alter table public.careers drop constraint if exists careers_training_level_check;
alter table public.careers add constraint careers_training_level_check check (training_level between 1 and 3);

drop table if exists
  public.job_postings, public.programs, public.career_stories, public.events,
  public.employers, public.schools,
  public.provinces, public.cities, public.school_types, public.credentials, public.tuition_ranges,
  public.industries, public.company_sizes, public.job_levels, public.work_settings,
  public.salary_ranges, public.event_kinds, public.training_levels
  cascade;
