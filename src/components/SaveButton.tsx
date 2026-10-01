"use client";

import { useTransition } from "react";
import { toggleSaveCareer } from "@/app/actions";

export default function SaveButton({ slug, saved }: { slug: string; saved: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(() => toggleSaveCareer(slug, saved))}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
        saved ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 hover:border-brand-500"
      }`}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
