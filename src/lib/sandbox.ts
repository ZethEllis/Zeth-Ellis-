import {
  DIMENSIONS,
  LENSES,
  PREF_KEYS,
  type Career,
  type Dimension,
  type Lens,
  type PrefKey,
  type Profile,
  type Scenario,
} from "./types";

export const DIM_LABEL: Record<Dimension, string> = {
  realistic: "hands-on, practical work",
  investigative: "problem-solving and analysis",
  artistic: "creative work",
  social: "helping and teaching people",
  enterprising: "leading and persuading",
  conventional: "structure and detail",
};

export const PREF_LABEL: Record<PrefKey, string> = {
  independence: "independent work",
  social: "social interaction",
  creativity: "creative freedom",
  stability: "job stability",
  income: "high income",
};

export const LENS_LABEL: Record<Lens, string> = {
  interests: "Interests",
  workstyle: "Work style",
  practical: "Practical",
};

export const LENS_HELP: Record<Lens, string> = {
  interests: "What you enjoy doing, compared with what the work involves.",
  workstyle: "How you like to work (independence, people, creativity, stability).",
  practical: "Training time, income goals and the current employment outlook.",
};

const WORKSTYLE_KEYS: PrefKey[] = ["independence", "social", "creativity", "stability"];

export type ReasonKind = "match" | "partial" | "mismatch";

export interface Reason {
  kind: ReasonKind;
  lens: Lens;
  text: string;
  gap: number; // how far apart you and the career are (0..1); used for ordering
}

export interface Evaluated {
  career: Career;
  lensScores: Record<Lens, number>; // 0..100
  score: number; // 0..100 combined
  rank: number;
  lensRanks: Record<Lens, number>;
  reasons: Reason[];
  /** The lenses rank this career very differently — worth a closer look. */
  disagreement: boolean;
}

const level = (v: number) => (v >= 0.67 ? "high" : v >= 0.34 ? "moderate" : "low");
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
/** Closeness 0..1, stretched so scores spread out instead of all landing in the 70s. */
const closeness = (diffs: number[]) => clamp01(1 - 1.5 * mean(diffs));

export const DEFAULT_SCENARIO: Scenario = {
  interests: Object.fromEntries(DIMENSIONS.map((d) => [d, 0.5])) as Profile,
  prefs: { independence: 0.5, social: 0.5, creativity: 0.5, stability: 0.5, income: 0.5 },
  maxTraining: 3,
  weights: { interests: 0.4, workstyle: 0.3, practical: 0.3 },
};

function buildReasons(s: Scenario, c: Career): Reason[] {
  const out: Reason[] = [];

  for (const d of DIMENSIONS) {
    const u = s.interests[d];
    const v = c.riasec[d];
    const gap = Math.abs(u - v);
    if (u >= 0.6 && gap <= 0.2) {
      out.push({ kind: "match", lens: "interests", gap, text: `Strong alignment with your interest in ${DIM_LABEL[d]}` });
    } else if (u >= 0.5 && gap <= 0.35) {
      out.push({ kind: "partial", lens: "interests", gap, text: `Moderate alignment with your interest in ${DIM_LABEL[d]}` });
    } else if (u >= 0.6 && v < 0.4) {
      out.push({ kind: "mismatch", lens: "interests", gap, text: `You're drawn to ${DIM_LABEL[d]}, but this career involves little of it` });
    } else if (u < 0.4 && v >= 0.7) {
      out.push({ kind: "mismatch", lens: "interests", gap, text: `This career leans heavily on ${DIM_LABEL[d]}, which you rated low` });
    }
  }

  for (const k of PREF_KEYS) {
    const u = s.prefs[k];
    const v = c.prefs[k];
    const gap = Math.abs(u - v);
    const lens: Lens = k === "income" ? "practical" : "workstyle";
    if (gap <= 0.2) {
      out.push({ kind: "match", lens, gap, text: `Strong alignment with your preference for ${PREF_LABEL[k]}` });
    } else if (gap <= 0.4) {
      out.push({ kind: "partial", lens, gap, text: `Moderate alignment with your preference for ${PREF_LABEL[k]}` });
    } else {
      out.push({
        kind: "mismatch", lens, gap,
        text: `Potential mismatch on ${PREF_LABEL[k]}: you rated it ${level(u)}, this career is typically ${level(v)}`,
      });
    }
  }

  if (c.training_level > s.maxTraining) {
    out.push({
      kind: "mismatch", lens: "practical", gap: 0.5,
      text: `Typically needs more training than you want to invest (${c.education})`,
    });
  } else {
    out.push({ kind: "match", lens: "practical", gap: 0, text: "Fits the amount of training you're open to" });
  }

  if (c.outlook_score >= 0.7) {
    out.push({ kind: "match", lens: "practical", gap: 0, text: `Positive current employment outlook (${c.outlook.toLowerCase()})` });
  } else if (c.outlook_score < 0.55) {
    out.push({ kind: "mismatch", lens: "practical", gap: 0.4, text: `Less certain employment outlook (${c.outlook.toLowerCase()})` });
  }

  // Matches first (tightest first), then partials, then mismatches (biggest conflict first).
  const order: Record<ReasonKind, number> = { match: 0, partial: 1, mismatch: 2 };
  return out.sort((a, b) =>
    order[a.kind] - order[b.kind] || (a.kind === "mismatch" ? b.gap - a.gap : a.gap - b.gap));
}

export function evaluate(s: Scenario, careers: Career[]): Evaluated[] {
  const rows = careers.map((career) => {
    const interests = closeness(DIMENSIONS.map((d) => Math.abs(s.interests[d] - career.riasec[d])));
    const workstyle = closeness(WORKSTYLE_KEYS.map((k) => Math.abs(s.prefs[k] - career.prefs[k])));
    const trainingFit = career.training_level <= s.maxTraining ? 1 : Math.max(0, 1 - 0.4 * (career.training_level - s.maxTraining));
    const incomeFit = 1 - Math.abs(s.prefs.income - career.prefs.income);
    const practical = mean([trainingFit, incomeFit, career.outlook_score]);

    const lensScores = {
      interests: Math.round(interests * 100),
      workstyle: Math.round(workstyle * 100),
      practical: Math.round(practical * 100),
    };
    const totalWeight = LENSES.reduce((t, l) => t + s.weights[l], 0);
    const combined = totalWeight > 0
      ? LENSES.reduce((t, l) => t + s.weights[l] * lensScores[l], 0) / totalWeight
      : mean(Object.values(lensScores));

    return { career, lensScores, score: Math.round(combined), reasons: buildReasons(s, career) };
  });

  const rankBy = (get: (r: (typeof rows)[number]) => number) => {
    const sorted = [...rows].sort((a, b) => get(b) - get(a));
    return new Map(sorted.map((r, i) => [r.career.slug, i + 1]));
  };
  const combinedRanks = rankBy((r) => r.score);
  const lensRankMaps = Object.fromEntries(LENSES.map((l) => [l, rankBy((r) => r.lensScores[l])])) as Record<Lens, Map<string, number>>;

  return rows
    .map((r) => {
      const lensRanks = Object.fromEntries(LENSES.map((l) => [l, lensRankMaps[l].get(r.career.slug)!])) as Record<Lens, number>;
      const ranks = Object.values(lensRanks);
      return {
        ...r,
        rank: combinedRanks.get(r.career.slug)!,
        lensRanks,
        disagreement: Math.max(...ranks) - Math.min(...ranks) >= 6,
      };
    })
    .sort((a, b) => a.rank - b.rank);
}

export interface Groups {
  best: Evaluated[];
  mismatches: Evaluated[];
  adjacent: { item: Evaluated; note: string }[];
  unexpected: { item: Evaluated; note: string }[];
}

const dominant = (c: Career): Dimension =>
  [...DIMENSIONS].sort((a, b) => c.riasec[b] - c.riasec[a])[0];

function distance(a: Career, b: Career) {
  const dims = DIMENSIONS.map((d) => Math.abs(a.riasec[d] - b.riasec[d]));
  const prefs = PREF_KEYS.map((k) => Math.abs(a.prefs[k] - b.prefs[k]));
  return mean([...dims, ...prefs]);
}

export function groupResults(s: Scenario, evals: Evaluated[]): Groups {
  const best = evals.slice(0, 4);
  const bestSlugs = new Set(best.map((e) => e.career.slug));
  const rest = evals.filter((e) => !bestSlugs.has(e.career.slug));

  // Potential mismatches: the weakest fits, with the conflicts spelled out on each card.
  const mismatches = [...rest].reverse().slice(0, 3);

  // Adjacent: closest in character to your top matches, even if not a top-scoring fit themselves.
  const adjacent: Groups["adjacent"] = [];
  const picked = new Set<string>();
  for (const anchor of [best[0], best[1], best[0]]) {
    if (!anchor) continue;
    const next = rest
      .filter((e) => !picked.has(e.career.slug))
      .sort((a, b) => distance(a.career, anchor.career) - distance(b.career, anchor.career))[0];
    if (!next) continue;
    picked.add(next.career.slug);
    const shared = [...DIMENSIONS].sort(
      (a, b) => Math.min(next.career.riasec[b], anchor.career.riasec[b]) - Math.min(next.career.riasec[a], anchor.career.riasec[a]),
    )[0];
    adjacent.push({ item: next, note: `Similar to ${anchor.career.title}: both lean on ${DIM_LABEL[shared]}` });
  }

  // Unexpected: decent fits whose core work differs from your strongest interests.
  const userTop = [...DIMENSIONS].sort((a, b) => s.interests[b] - s.interests[a]).slice(0, 2);
  const unexpected = rest
    .filter((e) => !picked.has(e.career.slug) && !userTop.includes(dominant(e.career)))
    .slice(0, 2)
    .map((item) => {
      const strongest = [...LENSES].sort((a, b) => item.lensScores[b] - item.lensScores[a])[0];
      return {
        item,
        note: `Mostly ${DIM_LABEL[dominant(item.career)]} — outside your top interests, but it scores well on ${LENS_LABEL[strongest].toLowerCase()} (${item.lensScores[strongest]}%)`,
      };
    });

  return { best, mismatches, adjacent, unexpected };
}

export interface Snapshot {
  id: string;
  name: string;
  scenario: Scenario;
  top: string[]; // slugs of the top 5 when saved
}

export function summarize(args: {
  groups: Groups;
  evals: Evaluated[];
  exploredCount: number;
  reflections: Record<string, string>;
  selfNotes: string;
}): string {
  const { groups, evals, exploredCount, reflections, selfNotes } = args;
  const titleOf = (slug: string) => evals.find((e) => e.career.slug === slug)?.career.title ?? slug;
  const lines: string[] = [];

  lines.push(`I've explored ${exploredCount} careers in the Career E-Sandbox.`, "");
  lines.push("My strongest matches right now:");
  groups.best.slice(0, 3).forEach((e) => {
    const why = e.reasons.filter((r) => r.kind === "match").slice(0, 2).map((r) => r.text.toLowerCase());
    lines.push(`• ${e.career.title} (${e.score}%)${why.length ? " — " + why.join("; ") : ""}`);
  });

  const conflicts = evals.filter((e) => e.disagreement && e.rank <= 6);
  if (conflicts.length) {
    lines.push("", "Where the different perspectives disagree:");
    conflicts.slice(0, 3).forEach((e) =>
      lines.push(`• ${e.career.title}: interests rank #${e.lensRanks.interests}, work style #${e.lensRanks.workstyle}, practical #${e.lensRanks.practical}`));
  }

  const concerns = groups.best.slice(0, 3).flatMap((e) =>
    e.reasons.filter((r) => r.kind === "mismatch").slice(0, 1).map((r) => `• ${e.career.title}: ${r.text}`));
  if (concerns.length) lines.push("", "Concerns I want to talk through:", ...concerns);

  if (groups.adjacent.length || groups.unexpected.length) {
    lines.push("", "Careers I want to investigate further:");
    [...groups.adjacent, ...groups.unexpected].forEach(({ item }) => lines.push(`• ${item.career.title}`));
  }

  const notes = Object.entries(reflections).filter(([, v]) => v.trim());
  if (notes.length) {
    lines.push("", "My reflections:");
    notes.forEach(([slug, v]) => lines.push(`• ${titleOf(slug)}: ${v.trim()}`));
  }
  if (selfNotes.trim()) lines.push("", "What I've learned about myself:", selfNotes.trim());

  return lines.join("\n");
}
