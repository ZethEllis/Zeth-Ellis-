import StepCard from "./StepCard";

const STEPS = [
  { n: "1", title: "Answer 13 quick questions", description: "About what energizes you and how much training you're open to." },
  { n: "2", title: "See your best-fit careers", description: "We rank paths by how closely they match your interests." },
  { n: "3", title: "Shortlist and explore", description: "Save the ones that spark something and compare them." },
];

export default function HowItWorks() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {STEPS.map((s) => <StepCard key={s.n} {...s} />)}
    </section>
  );
}
