import { SETTING_LABEL } from "@/lib/sandbox";
import type { JobPosting } from "@/lib/opportunities";
import type { WorkSetting } from "@/lib/types";

const money = (n: number) => `$${Math.round(n / 1000)}k`;
const LEVEL: Record<string, string> = { entry: "Entry level", intermediate: "Mid level", senior: "Senior" };

export default function JobPostings({ jobs }: { jobs: JobPosting[] }) {
  if (!jobs.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Sample job openings</h2>
      <ul className="mt-3 grid gap-3">
        {jobs.map((j) => (
          <li key={j.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">{j.title}</p>
              <p className="text-sm font-medium text-brand-700">{money(j.salary_min)}–{money(j.salary_max)}</p>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {j.employer ? `${j.employer.name} · ${j.employer.city}, ${j.employer.province}` : "Employer not listed"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {LEVEL[j.level] ?? j.level} · {SETTING_LABEL[j.work_setting as WorkSetting] ?? j.work_setting}
              {j.salary_range ? ` · ${j.salary_range.label}` : ""} · Posted {j.posted_on}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
