import type { Program } from "@/lib/opportunities";

const length = (months: number) => (months % 12 === 0 ? `${months / 12} year${months === 12 ? "" : "s"}` : `${months} months`);

export default function TrainingPrograms({ programs }: { programs: Program[] }) {
  if (!programs.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Where to train</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {programs.map((p) => (
          <li key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-medium">{p.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {p.school ? `${p.school.name} · ${p.school.city}, ${p.school.province}` : "School not listed"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {p.credential[0].toUpperCase() + p.credential.slice(1)} · {length(p.length_months)} · ${p.tuition_per_year.toLocaleString("en-CA")}/year
              {p.tuition_range ? ` (${p.tuition_range.label})` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
