"use client";

export default function SelfNotes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">
        Notice what keeps pulling you in or putting you off. What do you enjoy? What drains you? What trade-offs are you willing to make?
        Then go back and adjust your inputs.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="e.g. I like creative work but not working alone — maybe something collaborative…"
        aria-label="What I'm learning about myself"
        className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}
