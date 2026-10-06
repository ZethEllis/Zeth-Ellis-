import { LENSES } from "@/lib/types";
import { LENS_HELP, LENS_LABEL, type Evaluated } from "@/lib/sandbox";

/** Shows each career's rank under every lens, so disagreement is visible instead of hidden. */
export default function PerspectivesTable({ evals }: { evals: Evaluated[] }) {
  const slugs = new Set<string>();
  evals.slice(0, 5).forEach((e) => slugs.add(e.career.slug));
  for (const l of LENSES) [...evals].sort((a, b) => a.lensRanks[l] - b.lensRanks[l]).slice(0, 2).forEach((e) => slugs.add(e.career.slug));
  const rows = evals.filter((e) => slugs.has(e.career.slug));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="px-3 py-2">Career</th>
            {LENSES.map((l) => <th key={l} className="px-3 py-2" title={LENS_HELP[l]}>{LENS_LABEL[l]}</th>)}
            <th className="px-3 py-2">Overall</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.career.slug} className={`border-t border-slate-100 ${e.disagreement ? "bg-amber-50/60" : ""}`}>
              <td className="px-3 py-2 font-medium">
                {e.career.title}
                {e.disagreement && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">disagreement</span>}
              </td>
              {LENSES.map((l) => (
                <td key={l} className="px-3 py-2">
                  <span className={e.lensRanks[l] <= 3 ? "font-semibold text-brand-700" : "text-slate-500"}>#{e.lensRanks[l]}</span>
                  <span className="ml-1 text-xs text-slate-400">{e.lensScores[l]}%</span>
                </td>
              ))}
              <td className="px-3 py-2 font-semibold">#{e.rank} <span className="text-xs font-normal text-slate-400">{e.score}%</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
