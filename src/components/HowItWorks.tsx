import StepCard from "./StepCard";

const STEPS = [
  { n: "1", title: "Set your starting point", description: "Take the 2-minute quiz or just move the sliders: what you enjoy, how you like to work, what matters to you." },
  { n: "2", title: "Experiment", description: "Change an input and watch your matches shift. Save scenarios and compare “what if” versions of you." },
  { n: "3", title: "Question the reasoning", description: "See why each career was suggested, where the perspectives disagree, and what might not fit." },
  { n: "4", title: "Take it to a human", description: "Walk into your next conversation with a counselor or mentor with real findings, not “I have no idea.”" },
];

export default function HowItWorks() {
  return (
    <section>
      <h2 className="mb-4 text-center text-2xl font-bold">How it works</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => <StepCard key={s.n} {...s} />)}
      </div>
    </section>
  );
}
