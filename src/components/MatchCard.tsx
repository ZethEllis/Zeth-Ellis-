"use client";

import { useState } from "react";
import Link from "next/link";
import LensBars from "./LensBars";
import ReasonList from "./ReasonList";
import SaveOrSignIn from "./SaveOrSignIn";
import type { Evaluated } from "@/lib/sandbox";

export default function MatchCard({
  item, note, saved, canSave, reflection, onReflect, onViewed, defaultOpen = false,
}: {
  item: Evaluated;
  note?: string;
  saved: boolean;
  canSave: boolean;
  reflection: string;
  onReflect: (text: string) => void;
  onViewed: (slug: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { career } = item;

  function toggle() {
    if (!open) onViewed(career.slug);
    setOpen(!open);
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            <Link href={`/careers/${career.slug}`} className="hover:text-brand-600">{career.title}</Link>
          </h3>
          <p className="mt-1 text-sm text-slate-600">{career.summary}</p>
          {note && <p className="mt-2 text-sm font-medium text-brand-700">{note}</p>}
        </div>
        <div className="shrink-0 text-center">
          <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">{item.score}%</div>
          <div className="mt-1 text-xs text-slate-400">#{item.rank}</div>
        </div>
      </div>

      <div className="mt-3"><LensBars scores={item.lensScores} /></div>
      {item.disagreement && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          The perspectives disagree on this one (interests #{item.lensRanks.interests}, work style #{item.lensRanks.workstyle}, practical #{item.lensRanks.practical}).
        </p>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <button onClick={toggle} aria-expanded={open} className="font-medium text-brand-600 hover:underline">
          {open ? "Hide the reasoning" : "Why this career?"}
        </button>
        <SaveOrSignIn slug={career.slug} saved={saved} canSave={canSave} />
      </div>

      {open && (
        <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4">
          <ReasonList reasons={item.reasons} />
          <p className="text-xs text-slate-500">
            Based only on the inputs you set and our sample career data — an estimate with real uncertainty, not a verdict. Change an input to test it.
          </p>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">What aspects of {career.title.toLowerCase()} appeal to you — and which don&apos;t?</span>
            <textarea
              value={reflection}
              onChange={(e) => onReflect(e.target.value)}
              rows={3}
              placeholder="Your own words…"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
            />
          </label>
        </div>
      )}
    </article>
  );
}
