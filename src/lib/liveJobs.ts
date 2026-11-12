/**
 * Live Canadian job ads from the Adzuna API (https://developer.adzuna.com).
 * Runs on the server only: the app ID and key come from Vercel environment variables
 * and are never sent to the browser (no NEXT_PUBLIC_ prefix).
 */
export type LiveJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  url: string;
  created: string;
};

export const isLiveJobsConfigured = () =>
  Boolean(process.env.ADZUNA_APP_ID?.trim() && process.env.ADZUNA_APP_KEY?.trim());

type AdzunaResult = {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
};

// Adzuna wraps matched words in <strong> tags; show plain text.
const clean = (s: string) => s.replace(/<[^>]+>/g, "").trim();

/** Up to `limit` current job ads in Canada for a career title. Returns [] if not set up or the call fails. */
export async function getLiveJobs(careerTitle: string, limit = 5): Promise<LiveJob[]> {
  if (!isLiveJobsConfigured()) return [];
  // "Chef / Cook" searches better as "Chef".
  const what = careerTitle.split("/")[0].trim();
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID!.trim(),
    app_key: process.env.ADZUNA_APP_KEY!.trim(),
    what,
    results_per_page: String(limit),
    sort_by: "date",
  });
  try {
    const res = await fetch(`https://api.adzuna.com/v1/api/jobs/ca/search/1?${params}`, {
      // Cache for 6 hours: keeps pages fast and stays well inside Adzuna's free limits.
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) {
      console.error("Adzuna request failed:", res.status); // never log the URL, it contains the key
      return [];
    }
    const data: { results?: AdzunaResult[] } = await res.json();
    return (data.results ?? []).map((r) => ({
      id: r.id,
      title: clean(r.title),
      company: r.company?.display_name ?? "Company not listed",
      location: r.location?.display_name ?? "Canada",
      salaryMin: r.salary_min,
      salaryMax: r.salary_max,
      url: r.redirect_url,
      created: r.created,
    }));
  } catch (e) {
    console.error("Adzuna request failed:", e instanceof Error ? e.message : e);
    return [];
  }
}
