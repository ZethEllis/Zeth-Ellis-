import { NextResponse } from "next/server";
import { getCareer } from "@/lib/careers";

/**
 * GET /api/live-jobs?career=<slug>
 * Live Canadian job ads for one career, from the Adzuna API (https://developer.adzuna.com).
 * The call to Adzuna happens here, on the server. The app ID and key come from Vercel environment
 * variables (no NEXT_PUBLIC_ prefix), so they never reach the browser and are never committed.
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

const UNAVAILABLE = "Live job ads aren't available right now.";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("career") ?? "";
  // Only search for careers that exist on this site, so the route can't be used to run any search.
  const career = await getCareer(slug);
  if (!career) return NextResponse.json({ error: "Unknown career." }, { status: 404 });

  const appId = process.env.ADZUNA_APP_ID?.trim();
  const appKey = process.env.ADZUNA_APP_KEY?.trim();
  if (!appId || !appKey) {
    console.error("Live jobs: ADZUNA_APP_ID or ADZUNA_APP_KEY is not set.");
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: career.title.split("/")[0].trim(), // "Chef / Cook" searches better as "Chef"
    results_per_page: "5",
    sort_by: "date",
  });

  try {
    const res = await fetch(`https://api.adzuna.com/v1/api/jobs/ca/search/1?${params}`, {
      // Cache for 6 hours: keeps pages fast and stays well inside Adzuna's free limits.
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) {
      // Log the full reason Adzuna gives, but never the request URL: it contains the key.
      const body = await res.text().catch(() => "");
      console.error(`Live jobs: Adzuna returned ${res.status} for "${career.slug}": ${body.slice(0, 300)}`);
      return NextResponse.json({ error: UNAVAILABLE }, { status: 502 });
    }
    const data: { results?: AdzunaResult[] } = await res.json();
    const jobs: LiveJob[] = (data.results ?? []).map((r) => ({
      id: r.id,
      title: clean(r.title),
      company: r.company?.display_name ?? "Company not listed",
      location: r.location?.display_name ?? "Canada",
      salaryMin: r.salary_min,
      salaryMax: r.salary_max,
      url: r.redirect_url,
      created: r.created,
    }));
    return NextResponse.json({ jobs });
  } catch (e) {
    console.error(`Live jobs: request to Adzuna failed for "${career.slug}":`, e instanceof Error ? e.message : e);
    return NextResponse.json({ error: UNAVAILABLE }, { status: 502 });
  }
}
