import StepCard from "./StepCard";

const STEPS = [
  { n: "1", title: "Tell us about you", description: "Answer a few quick questions or move the sliders." },
  { n: "2", title: "See your matches", description: "Every match shows the reasons behind it." },
  { n: "3", title: "Compare and save", description: "Put careers side by side and keep a shortlist." },
];

export default function HowItWorks() {
  return (
    <section className="mt-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => <StepCard key={s.n} {...s} />)}
      </div>
    </section>
  );
}
