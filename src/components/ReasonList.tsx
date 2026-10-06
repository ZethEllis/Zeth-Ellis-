import type { Reason } from "@/lib/sandbox";

const STYLE = {
  match: { icon: "✓", cls: "text-green-700" },
  partial: { icon: "~", cls: "text-amber-700" },
  mismatch: { icon: "✕", cls: "text-red-700" },
} as const;

export default function ReasonList({ reasons, limit = 7 }: { reasons: Reason[]; limit?: number }) {
  // Always keep mismatches visible, then fill with the best of the rest.
  const mismatches = reasons.filter((r) => r.kind === "mismatch");
  const others = reasons.filter((r) => r.kind !== "mismatch");
  const shown = [...others.slice(0, Math.max(limit - mismatches.length, 3)), ...mismatches.slice(0, 3)];
  return (
    <ul className="grid gap-1 text-sm">
      {shown.map((r, i) => (
        <li key={i} className={`flex gap-2 ${STYLE[r.kind].cls}`}>
          <span aria-hidden className="w-4 shrink-0 text-center font-bold">{STYLE[r.kind].icon}</span>
          <span className="text-slate-700">{r.text}</span>
        </li>
      ))}
    </ul>
  );
}
