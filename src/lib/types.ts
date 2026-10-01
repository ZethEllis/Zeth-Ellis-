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

/** 1 = under a year, 2 = ~2 years, 3 = 4+ years */
export type TrainingLevel = 1 | 2 | 3;

export interface Career {
  slug: string;
  title: string;
  summary: string;
  salary_range: string;
  education: string;
  outlook: string;
  training_level: TrainingLevel;
  riasec: Profile;
  skills: string[];
}

export interface CareerMatch extends Career {
  score: number; // 0..100
}
