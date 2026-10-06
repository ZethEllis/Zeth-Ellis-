export const DIMENSIONS = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];
export type Profile = Record<Dimension, number>; // each 0..1

export const PREF_KEYS = ["independence", "social", "creativity", "stability", "income"] as const;
export type PrefKey = (typeof PREF_KEYS)[number];
export type Prefs = Record<PrefKey, number>; // each 0..1

/** The three lenses the sandbox compares. */
export const LENSES = ["interests", "workstyle", "practical"] as const;
export type Lens = (typeof LENSES)[number];

/** 1 = under a year, 2 = ~2 years, 3 = 4+ years */
export type TrainingLevel = 1 | 2 | 3;

export interface Career {
  slug: string;
  title: string;
  summary: string;
  salary_range: string;
  education: string;
  outlook: string;
  outlook_score: number; // 0..1, higher = stronger current employment outlook
  training_level: TrainingLevel;
  riasec: Profile;
  prefs: Prefs; // how the work typically feels: how independent, social, creative, stable, high-paying
  skills: string[];
}

/** Everything the user can change in the sandbox. */
export interface Scenario {
  interests: Profile;
  prefs: Prefs;
  maxTraining: TrainingLevel;
  weights: Record<Lens, number>; // how much each lens counts, 0..1
}
