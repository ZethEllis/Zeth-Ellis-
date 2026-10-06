"use client";

import { useState } from "react";

export default function AdvisorSummary({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the text is still selectable below
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">
        A starting point for your next conversation with a counselor, teacher, parent or mentor. Edit it, copy it, or print this page.
      </p>
      <textarea
        readOnly
        value={text}
        rows={14}
        aria-label="Summary to share with an advisor"
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs"
      />
      <div className="mt-3 flex gap-3 text-sm">
        <button onClick={copy} className="rounded-xl bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
          {copied ? "Copied ✓" : "Copy summary"}
        </button>
        <button onClick={() => window.print()} className="rounded-xl border border-slate-300 px-4 py-2 hover:border-brand-500">
          Print
        </button>
      </div>
    </div>
  );
}
