import { QUESTIONS } from "./quiz";
import { DIMENSIONS, type Career, type CareerMatch, type Profile, type TrainingLevel } from "./types";

/** Average the 1..5 answers per dimension into a 0..1 profile. `answers` is ordered like QUESTIONS. */
export function scoreAnswers(answers: number[]): Profile {
  const sums = Object.fromEntries(DIMENSIONS.map((d) => [d, { total: 0, n: 0 }])) as Record<
    (typeof DIMENSIONS)[number],
    { total: number; n: number }
  >;
  QUESTIONS.forEach((q, i) => {
    const a = Math.min(5, Math.max(1, answers[i] ?? 3));
    sums[q.dimension].total += (a - 1) / 4;
    sums[q.dimension].n += 1;
  });
  return Object.fromEntries(
    DIMENSIONS.map((d) => [d, sums[d].n ? sums[d].total / sums[d].n : 0.5]),
  ) as Profile;
}

/** Compare the user's profile to each career; closer profile = higher score. Careers needing more training than the user wants are penalised. */
export function matchCareers(profile: Profile, maxTraining: TrainingLevel, careers: Career[]): CareerMatch[] {
  return careers
    .map((c) => {
      const diff = DIMENSIONS.reduce((s, d) => s + Math.abs(profile[d] - c.riasec[d]), 0) / DIMENSIONS.length;
      let score = (1 - diff) * 100;
      if (c.training_level > maxTraining) score -= 15 * (c.training_level - maxTraining);
      return { ...c, score: Math.max(0, Math.round(score)) };
    })
    .sort((a, b) => b.score - a.score);
}

export function topTraits(profile: Profile, n = 3) {
  return [...DIMENSIONS].sort((a, b) => profile[b] - profile[a]).slice(0, n);
}

/** Profile <-> URL helpers so results are shareable and need no login. */
export function encodeAnswers(answers: number[], training: TrainingLevel) {
  return `${answers.join("")}-${training}`;
}

export function decodeAnswers(code: string | undefined) {
  const m = code?.match(/^([1-5]{12})-([123])$/);
  if (!m) return null;
  return { answers: m[1].split("").map(Number), training: Number(m[2]) as TrainingLevel };
}
