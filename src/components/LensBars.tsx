import { LENSES } from "@/lib/types";
import { LENS_LABEL } from "@/lib/sandbox";

export default function LensBars({ scores }: { scores: Record<(typeof LENSES)[number], number> }) {
  return (
    <div className="grid gap-1">
      {LENSES.map((l) => (
        <div key={l} className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-20 shrink-0">{LENS_LABEL[l]}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand-500" style={{ width: `${scores[l]}%` }} />
          </div>
          <span className="w-8 text-right">{scores[l]}%</span>
        </div>
      ))}
    </div>
  );
}
