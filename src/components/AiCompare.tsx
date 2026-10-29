"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { compareWithAI } from "@/app/actions";

/** "Ask AI" panel under the comparison table. Gemini writes a plain-language comparison of the picked careers. */
export default function AiCompare({ slugs, signedIn }: { slugs: string[]; signedIn: boolean }) {
  const [answer, setAnswer] = useState<{ key: string; text?: string; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const key = slugs.join(",");
  const current = answer?.key === key ? answer : null;

  function ask() {
    startTransition(async () => {
      const res = await compareWithAI(slugs);
      setAnswer({ key, ...res });
    });
  }

  return (
    <section className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Ask AI to compare</h2>
          <p className="text-sm text-slate-600">Gemini explains the differences in plain language, using the data on this site.</p>
        </div>
        {signedIn ? (
          <button
            onClick={ask}
            disabled={pending}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Thinking…" : current?.text ? "Ask again" : "Compare with AI"}
          </button>
        ) : (
          <Link href="/login" className="rounded-xl border border-brand-600 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
            Sign in to use AI
          </Link>
        )}
      </div>
      {current?.text && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">{current.text}</p>}
      {current?.error && <p className="mt-4 text-sm text-red-600">{current.error}</p>}
      {current?.text && <p className="mt-3 text-xs text-slate-500">AI-generated from sample data. Double-check before making decisions.</p>}
    </section>
  );
}
