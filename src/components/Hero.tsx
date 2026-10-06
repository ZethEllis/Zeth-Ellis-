import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">Career E-Sandbox</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Don&apos;t take a test. <span className="text-brand-600">Explore possibilities.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        No single test can answer “What is the best career for me?” So instead of handing you a verdict, we give you an environment to
        experiment in: change your assumptions, compare perspectives, question every recommendation, and learn about yourself along the way.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/sandbox" className="rounded-xl bg-brand-600 px-6 py-3 text-lg font-medium text-white hover:bg-brand-700">
          Open the sandbox
        </Link>
        <Link href="/quiz" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-lg font-medium hover:border-brand-500">
          Start with a quick quiz
        </Link>
      </div>
    </section>
  );
}
