import type { Career } from "@/lib/types";

export default function CareerFacts({ career }: { career: Career }) {
  const facts = [
    ["Typical pay", career.salary_range],
    ["Education", career.education],
    ["Outlook", career.outlook],
  ];
  return (
    <dl className="mt-6 grid gap-4 sm:grid-cols-3">
      {facts.map(([k, v]) => (
        <div key={k} className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-sm text-slate-500">{k}</dt>
          <dd className="mt-1 font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
