import type { LiveJob } from "@/lib/liveJobs";

const money = (n: number) => `$${Math.round(n / 1000)}k`;
const date = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

export default function LiveJobs({ jobs }: { jobs: LiveJob[] }) {
  if (!jobs.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Live job openings in Canada</h2>
      <p className="mt-1 text-sm text-slate-500">Real ads posted recently, refreshed a few times a day.</p>
      <ul className="mt-3 grid gap-3">
        {jobs.map((j) => (
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
    </section>
  );
}
