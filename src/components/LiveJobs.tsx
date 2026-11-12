"use client";

import { useEffect, useState } from "react";
import type { LiveJob } from "@/app/api/live-jobs/route";

const money = (n: number) => `$${Math.round(n / 1000)}k`;
const date = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
const FALLBACK = "Live job ads aren't available right now.";

type State = { status: "loading" } | { status: "ok"; jobs: LiveJob[] } | { status: "error"; message: string };

/** Live job ads for one career, loaded from this site's own /api/live-jobs route (never from Adzuna directly). */
export default function LiveJobs({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/live-jobs?career=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && Array.isArray(data.jobs)) setState({ status: "ok", jobs: data.jobs });
        else setState({ status: "error", message: data.error ?? FALLBACK });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", message: FALLBACK });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Live job openings in Canada</h2>
      {state.status === "loading" && <p className="mt-2 text-sm text-slate-500">Loading recent job ads…</p>}
      {state.status === "error" && (
        <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {state.message} The sample openings below still show what this career looks like.
        </p>
      )}
      {state.status === "ok" && !state.jobs.length && (
        <p className="mt-2 text-sm text-slate-500">No recent ads found for this career. Check the sample openings below.</p>
      )}
      {state.status === "ok" && state.jobs.length > 0 && (
        <>
          <p className="mt-1 text-sm text-slate-500">Real ads posted recently, refreshed a few times a day.</p>
          <ul className="mt-3 grid gap-3">
            {state.jobs.map((j) => (
              <li key={j.id}>
                <a
                  href={j.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-500"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{j.title}</p>
                    {j.salaryMin && j.salaryMax ? (
                      <p className="text-sm font-medium text-brand-700">
                        {money(j.salaryMin)}–{money(j.salaryMax)}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {j.company} · {j.location}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Posted {date(j.created)} · View ad ↗</p>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            <a href="https://www.adzuna.ca" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Jobs by Adzuna
            </a>
          </p>
        </>
      )}
    </section>
  );
}
