"use client";

import { useEffect, useMemo, useState } from "react";
import AdvisorSummary from "./AdvisorSummary";
import MatchCard from "./MatchCard";
import PerspectivesTable from "./PerspectivesTable";
import ResultSection from "./ResultSection";
import ScenarioControls from "./ScenarioControls";
import ScenarioHistory from "./ScenarioHistory";
import SelfNotes from "./SelfNotes";
import { DEFAULT_SCENARIO, evaluate, groupResults, summarize, type Snapshot } from "@/lib/sandbox";
import { usePersistedState } from "@/lib/usePersistedState";
import type { Career, Profile, Scenario, TrainingLevel } from "@/lib/types";

export default function Sandbox({
  careers, seed, seedTraining, canSave, savedSlugs,
}: {
  careers: Career[];
  seed?: Profile;
  seedTraining?: TrainingLevel;
  canSave: boolean;
  savedSlugs: string[];
}) {
  const [scenario, setScenario] = usePersistedState<Scenario>("sandbox:scenario", DEFAULT_SCENARIO);
  const [snapshots, setSnapshots] = usePersistedState<Snapshot[]>("sandbox:snapshots", []);
  const [reflections, setReflections] = usePersistedState<Record<string, string>>("sandbox:reflections", {});
  const [selfNotes, setSelfNotes] = usePersistedState<string>("sandbox:self", "");
  const [viewed, setViewed] = usePersistedState<string[]>("sandbox:viewed", []);
  const [showMobileControls, setShowMobileControls] = useState(false);

  // A fresh quiz result seeds the interest sliders; runs after the stored scenario loads.
  useEffect(() => {
    if (seed) setScenario((s) => ({ ...s, interests: seed, maxTraining: seedTraining ?? s.maxTraining }));
  }, [seed, seedTraining, setScenario]);

  const evals = useMemo(() => evaluate(scenario, careers), [scenario, careers]);
  const groups = useMemo(() => groupResults(scenario, evals), [scenario, evals]);
  const titleOf = (slug: string) => careers.find((c) => c.slug === slug)?.title ?? slug;
  const saved = new Set(savedSlugs);

  const markViewed = (slug: string) => setViewed((v) => (v.includes(slug) ? v : [...v, slug]));
  const reflect = (slug: string, text: string) => setReflections((r) => ({ ...r, [slug]: text }));

  const exploredCount = new Set([...viewed, ...Object.keys(reflections).filter((k) => reflections[k]?.trim())]).size;
  const summary = summarize({ groups, evals, exploredCount, reflections, selfNotes });

  const card = (item: (typeof evals)[number], note?: string, defaultOpen = false) => (
    <MatchCard
      key={item.career.slug}
      item={item}
      note={note}
      saved={saved.has(item.career.slug)}
      canSave={canSave}
      reflection={reflections[item.career.slug] ?? ""}
      onReflect={(t) => reflect(item.career.slug, t)}
      onViewed={markViewed}
      defaultOpen={defaultOpen}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="print:hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
        <button
          onClick={() => setShowMobileControls(!showMobileControls)}
          className="mb-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium lg:hidden"
        >
          {showMobileControls ? "Hide inputs" : "Adjust your inputs"}
        </button>
        <div className={showMobileControls ? "" : "hidden lg:block"}>
          <ScenarioControls scenario={scenario} onChange={setScenario} onReset={() => setScenario(DEFAULT_SCENARIO)} />
        </div>
      </aside>

      <div className="grid gap-10">
        <header>
          <h1 className="text-3xl font-bold">Your sandbox</h1>
          <p className="mt-2 text-slate-600">
            Nothing here is a verdict. Move the sliders, open the reasoning, and see what changes.
            {exploredCount > 0 && <> You&apos;ve looked closely at <strong>{exploredCount}</strong> {exploredCount === 1 ? "career" : "careers"} so far.</>}
          </p>
        </header>

        <ResultSection title="Best matches" description="Strong alignment across several factors. Open “Why this career?” to see the reasoning and tell us what you think.">
          {groups.best.map((e, i) => card(e, undefined, i === 0))}
        </ResultSection>

        <ResultSection title="Compare perspectives" description="The same careers ranked three different ways. Where the lenses disagree, ask why — that's often where you learn the most.">
          <PerspectivesTable evals={evals} />
        </ResultSection>

        <ResultSection title="Adjacent careers" description="Not the strongest statistical match, but they share meaningful characteristics with your top picks.">
          {groups.adjacent.map(({ item, note }) => card(item, note))}
        </ResultSection>

        {groups.unexpected.length > 0 && (
          <ResultSection title="Unexpected options" description="You might not have considered these. They sit outside your strongest interests but fit in other ways.">
            {groups.unexpected.map(({ item, note }) => card(item, note))}
          </ResultSection>
        )}

        <ResultSection title="Potential mismatches" description="Where important characteristics conflict with your preferences or goals. Knowing what doesn't fit is just as useful.">
          {groups.mismatches.map((e) => card(e))}
        </ResultSection>

        <ResultSection title="What I'm learning about myself" description="Career exploration is also self-exploration.">
          <SelfNotes value={selfNotes} onChange={setSelfNotes} />
        </ResultSection>

        <div className="print:hidden">
          <ResultSection title="Scenarios" description="Save where you are, try different assumptions, and compare how your top matches shift.">
            <ScenarioHistory
              snapshots={snapshots}
              current={evals}
              titleOf={titleOf}
              onSave={(name) =>
                setSnapshots((all) => [...all, { id: crypto.randomUUID(), name, scenario, top: evals.slice(0, 5).map((e) => e.career.slug) }])
              }
              onLoad={(s) => setScenario(s.scenario)}
              onDelete={(id) => setSnapshots((all) => all.filter((s) => s.id !== id))}
            />
          </ResultSection>
        </div>

        <ResultSection title="Take it to a human" description="Bring something concrete to your next conversation with a counselor, mentor or parent.">
          <AdvisorSummary text={summary} />
        </ResultSection>
      </div>
    </div>
  );
}
