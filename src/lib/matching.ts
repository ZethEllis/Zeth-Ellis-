import { QUESTIONS } from "./quiz";
import { DIMENSIONS, type Profile, type TrainingLevel } from "./types";

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

/** Profile <-> URL helpers so quiz results can seed the sandbox without a login. */
export function encodeAnswers(answers: number[], training: TrainingLevel) {
  return `${answers.join("")}-${training}`;
}

export function decodeAnswers(code: string | undefined) {
  const m = code?.match(/^([1-5]{12})-([123])$/);
  if (!m) return null;
  return { answers: m[1].split("").map(Number), training: Number(m[2]) as TrainingLevel };
}
