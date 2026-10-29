"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DIM_LABEL, PREF_LABEL, SETTING_LABEL } from "@/lib/sandbox";
import AiCompare from "@/components/AiCompare";
import { DIMENSIONS, PREF_KEYS, type Career } from "@/lib/types";

const MAX = 3;
const TRAINING = { 1: "Under a year", 2: "About 2 years", 3: "4+ years" } as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function Bar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full bg-brand-500" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export default function CompareView({ careers, initial, signedIn }: { careers: Career[]; initial: string[]; signedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [slugs, setSlugs] = useState<string[]>(initial);
  const picked = slugs.map((s) => careers.find((c) => c.slug === s)!).filter(Boolean);
  const sorted = [...careers].sort((a, b) => a.title.localeCompare(b.title));

  function update(next: string[]) {
    setSlugs(next);
    router.replace(next.length ? `${pathname}?c=${next.join(",")}` : pathname, { scroll: false });
  }

  const rows: { label: string; render: (c: Career) => React.ReactNode }[] = [
    { label: "What it is", render: (c) => c.summary },
    { label: "Typical pay", render: (c) => c.salary_range },
    { label: "Education", render: (c) => c.education },
    { label: "Training time", render: (c) => TRAINING[c.training_level] },
    { label: "Outlook", render: (c) => c.outlook },
    { label: "Where you'd work", render: (c) => c.work_settings.map((w) => SETTING_LABEL[w]).join(" · ") || "Varies" },
    ...DIMENSIONS.map((d) => ({ label: cap(DIM_LABEL[d]), render: (c: Career) => <Bar value={c.riasec[d]} /> })),
    ...PREF_KEYS.map((k) => ({ label: cap(PREF_LABEL[k]), render: (c: Career) => <Bar value={c.prefs[k]} /> })),
    { label: "Key skills", render: (c) => c.skills.join(", ") },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Compare careers</h1>
      <p className="mt-2 text-slate-600">Pick up to {MAX} careers to see them side by side.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {picked.map((c) => (
          <span key={c.slug} className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            {c.title}
            <button onClick={() => update(slugs.filter((s) => s !== c.slug))} aria-label={`Remove ${c.title}`} className="hover:text-slate-900">
              ×
            </button>
          </span>
        ))}
        {slugs.length < MAX && (
          <select
            value=""
            onChange={(e) => e.target.value && update([...slugs, e.target.value])}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">+ Add a career…</option>
            {sorted.filter((c) => !slugs.includes(c.slug)).map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {picked.length >= 2 && <AiCompare slugs={picked.map((c) => c.slug)} signedIn={signedIn} />}

      {picked.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="w-40 p-3" />
                {picked.map((c) => (
                  <th key={c.slug} className="p-3 font-semibold">
                    <Link href={`/careers/${c.slug}`} className="hover:text-brand-600">{c.title}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-slate-100 last:border-0 align-top">
                  <th className="p-3 text-left font-medium text-slate-500">{r.label}</th>
                  {picked.map((c) => <td key={c.slug} className="p-3">{r.render(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Nothing to compare yet. Add a career above, or use “Compare” on any career card in the sandbox.
        </p>
      )}
    </div>
  );
}
