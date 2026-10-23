import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type JobPosting = {
  id: number;
  title: string;
  level: string;
  work_setting: string;
  salary_min: number;
  salary_max: number;
  posted_on: string;
  employer: { name: string; city: string; province: string } | null;
  salary_range: { label: string } | null;
};

export type Program = {
  id: number;
  name: string;
  credential: string;
  length_months: number;
  tuition_per_year: number;
  school: { name: string; type: string; city: string; province: string } | null;
  tuition_range: { label: string } | null;
};

/** Sample job postings for a career, newest first. Empty if Supabase isn't set up or the table is missing. */
export async function getJobPostings(slug: string): Promise<JobPosting[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, title, level, work_setting, salary_min, salary_max, posted_on, employer:employers(name, city, province), salary_range:salary_ranges(label)")
      .eq("career_slug", slug)
      .order("posted_on", { ascending: false });
    return error ? [] : (data as unknown as JobPosting[]);
  } catch {
    return [];
  }
}

/** Training programs that lead to a career, cheapest first. Empty if Supabase isn't set up or the table is missing. */
export async function getPrograms(slug: string): Promise<Program[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("id, name, credential, length_months, tuition_per_year, school:schools(name, type, city, province), tuition_range:tuition_ranges(label)")
      .eq("career_slug", slug)
      .order("tuition_per_year");
    return error ? [] : (data as unknown as Program[]);
  } catch {
    return [];
  }
}
