import type { Dimension, TrainingLevel } from "./types";

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
}

// Two statements per interest area, answered 1 (not me) .. 5 (very me).
export const QUESTIONS: Question[] = [
  { id: 1, dimension: "realistic", text: "I enjoy building, fixing, or working with my hands." },
  { id: 2, dimension: "realistic", text: "I'd rather be active or outdoors than at a desk all day." },
  { id: 3, dimension: "investigative", text: "I like digging into a problem until I understand why it happens." },
  { id: 4, dimension: "investigative", text: "I enjoy working with data, research, or science." },
  { id: 5, dimension: "artistic", text: "I like creating things — designs, writing, music, ideas." },
  { id: 6, dimension: "artistic", text: "I prefer work with room for my own style and originality." },
  { id: 7, dimension: "social", text: "I get energy from helping, teaching, or supporting people." },
  { id: 8, dimension: "social", text: "People often come to me to talk through their problems." },
  { id: 9, dimension: "enterprising", text: "I like leading, persuading, or starting new ventures." },
  { id: 10, dimension: "enterprising", text: "I'm comfortable taking risks to reach a big goal." },
  { id: 11, dimension: "conventional", text: "I like clear processes, organization, and getting details right." },
  { id: 12, dimension: "conventional", text: "I'm happiest when tasks are structured and predictable." },
];

export const LIKERT = [
  { value: 1, label: "Not me" },
  { value: 2, label: "Slightly" },
  { value: 3, label: "Somewhat" },
  { value: 4, label: "Mostly" },
  { value: 5, label: "Very me" },
];

export const TRAINING_OPTIONS: { value: TrainingLevel; label: string; hint: string }[] = [
  { value: 1, label: "Under a year", hint: "Bootcamp, certificate, on-the-job" },
  { value: 2, label: "Around 2 years", hint: "Diploma, apprenticeship, associate degree" },
  { value: 3, label: "4+ years is fine", hint: "Degree, graduate or professional school" },
];
