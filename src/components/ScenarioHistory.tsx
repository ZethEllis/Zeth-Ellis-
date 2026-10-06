"use client";

import { useState } from "react";
import type { Evaluated, Snapshot } from "@/lib/sandbox";

export default function ScenarioHistory({
  snapshots, current, titleOf, onSave, onLoad, onDelete,
}: {
  snapshots: Snapshot[];
  current: Evaluated[];
  titleOf: (slug: string) => string;
  onSave: (name: string) => void;
  onLoad: (s: Snapshot) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const nowTop = current.slice(0, 5).map((e) => e.career.slug);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(name.trim() || `Scenario ${snapshots.length + 1}`); setName(""); }}
        className="flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name this scenario (e.g. “If money mattered most”)"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">Save</button>
      </form>

      {snapshots.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Save a scenario, change some inputs, then compare how your top matches shift.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {snapshots.map((s) => {
            const added = nowTop.filter((slug) => !s.top.includes(slug));
            const dropped = s.top.filter((slug) => !nowTop.includes(slug));
            return (
              <li key={s.id} className="rounded-xl border border-slate-100 p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <strong>{s.name}</strong>
                  <span className="flex gap-3 text-xs">
                    <button onClick={() => onLoad(s)} className="text-brand-600 hover:underline">Load</button>
                    <button onClick={() => onDelete(s.id)} className="text-slate-400 hover:text-red-600">Delete</button>
                  </span>
                </div>
                <p className="mt-1 text-slate-600">Then: {s.top.map(titleOf).join(", ")}</p>
                <p className="text-slate-600">
                  vs. now:{" "}
                  {added.length || dropped.length
                    ? <>
                        {added.length > 0 && <span className="text-green-700">+ {added.map(titleOf).join(", ")} </span>}
                        {dropped.length > 0 && <span className="text-red-700">− {dropped.map(titleOf).join(", ")}</span>}
                      </>
                    : "same top 5"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
