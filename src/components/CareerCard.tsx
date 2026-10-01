import Link from "next/link";
import SaveOrSignIn from "./SaveOrSignIn";
import type { Career } from "@/lib/types";

export default function CareerCard({
  career, score, saved, canSave,
}: { career: Career; score?: number; saved: boolean; canSave: boolean }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            <Link href={`/careers/${career.slug}`} className="hover:text-brand-600">{career.title}</Link>
          </h3>
          <p className="mt-1 text-sm text-slate-600">{career.summary}</p>
        </div>
        {score !== undefined && (
          <div className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">{score}%</div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{career.salary_range} · {career.outlook}</span>
        <SaveOrSignIn slug={career.slug} saved={saved} canSave={canSave} />
      </div>
    </article>
  );
}
