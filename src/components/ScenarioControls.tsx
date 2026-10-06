"use client";

import Slider from "./Slider";
import { TRAINING_OPTIONS } from "@/lib/quiz";
import { DIM_LABEL, LENS_HELP, LENS_LABEL, PREF_LABEL } from "@/lib/sandbox";
import { DIMENSIONS, LENSES, PREF_KEYS, type Scenario, type TrainingLevel } from "@/lib/types";

const PREF_ENDS: Record<(typeof PREF_KEYS)[number], [string, string]> = {
  independence: ["Prefer teamwork", "Prefer working solo"],
  social: ["Little contact", "Constant people contact"],
  creativity: ["Clear instructions", "Total creative freedom"],
  stability: ["Comfortable with risk", "Need security"],
  income: ["Money isn't key", "Top priority"],
};

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {note && <p className="-mt-2 text-xs text-slate-500">{note}</p>}
      {children}
    </fieldset>
  );
}

export default function ScenarioControls({
  scenario, onChange, onReset,
}: { scenario: Scenario; onChange: (s: Scenario) => void; onReset: () => void }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your inputs</h2>
        <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-900">Reset</button>
      </div>

      <Group title="What you enjoy" note="Drag a slider and watch the matches move.">
        {DIMENSIONS.map((d) => (
          <Slider
            key={d}
            label={DIM_LABEL[d][0].toUpperCase() + DIM_LABEL[d].slice(1)}
            value={scenario.interests[d]}
            onChange={(v) => onChange({ ...scenario, interests: { ...scenario.interests, [d]: v } })}
          />
        ))}
      </Group>

      <Group title="How you like to work">
        {PREF_KEYS.map((k) => (
          <Slider
            key={k}
            label={PREF_LABEL[k][0].toUpperCase() + PREF_LABEL[k].slice(1)}
            value={scenario.prefs[k]}
            low={PREF_ENDS[k][0]}
            high={PREF_ENDS[k][1]}
            onChange={(v) => onChange({ ...scenario, prefs: { ...scenario.prefs, [k]: v } })}
          />
        ))}
      </Group>

      <Group title="Training you're open to">
        <div className="grid gap-2">
          {TRAINING_OPTIONS.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="radio"
                name="training"
                checked={scenario.maxTraining === o.value}
                onChange={() => onChange({ ...scenario, maxTraining: o.value as TrainingLevel })}
                className="mt-1 accent-brand-600"
              />
              <span><span className="font-medium">{o.label}</span> <span className="text-slate-500">— {o.hint}</span></span>
            </label>
          ))}
        </div>
      </Group>

      <Group title="How much each perspective counts" note="Try giving one perspective all the weight and see what changes.">
        {LENSES.map((l) => (
          <Slider
            key={l}
            label={LENS_LABEL[l]}
            hint={LENS_HELP[l]}
            value={scenario.weights[l]}
            low="Ignore"
            high="Count most"
            onChange={(v) => onChange({ ...scenario, weights: { ...scenario.weights, [l]: v } })}
          />
        ))}
      </Group>
    </div>
  );
}
