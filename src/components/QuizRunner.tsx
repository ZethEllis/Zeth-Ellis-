"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LIKERT, QUESTIONS, TRAINING_OPTIONS, WORKSTYLE_QUESTIONS } from "@/lib/quiz";
import { encodeAnswers } from "@/lib/matching";
import { saveResult } from "@/app/actions";
import type { TrainingLevel } from "@/lib/types";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";

export default function QuizRunner() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pending, startTransition] = useTransition();

  const statements = [...QUESTIONS.map((q) => q.text), ...WORKSTYLE_QUESTIONS.map((q) => q.text)];
  const total = statements.length + 1; // + training question
  const onTraining = step === statements.length;

  function answer(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
    setStep(step + 1);
  }

  function finish(training: TrainingLevel) {
    const code = encodeAnswers(answers, training);
    startTransition(async () => {
      await saveResult(code); // no-op when signed out
      router.push(`/sandbox?r=${code}`);
    });
  }

  return (
    <div className="mx-auto max-w-xl">
      <ProgressBar value={step / total} />
      <p className="mb-2 text-sm text-slate-500">Question {step + 1} of {total}</p>

      {onTraining ? (
        <QuestionCard
          title="How much training are you open to?"
          options={TRAINING_OPTIONS}
          disabled={pending}
          onSelect={(v) => finish(v as TrainingLevel)}
        />
      ) : (
        <>
          {step === QUESTIONS.length && (
            <p className="mb-3 text-sm font-medium text-brand-700">Now a few about how you like to work.</p>
          )}
          <QuestionCard title={statements[step]} options={LIKERT} onSelect={answer} />
        </>
      )}

      {step > 0 && !pending && (
        <button onClick={() => setStep(step - 1)} className="mt-6 text-sm text-slate-500 hover:text-slate-900">
          ← Back
        </button>
      )}
    </div>
  );
}
