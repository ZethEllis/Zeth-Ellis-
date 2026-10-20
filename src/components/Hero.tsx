import Link from "next/link";

export default function Hero({ careerCount }: { careerCount: number }) {
  return (
    <section className="py-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">Career E-Sandbox</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Figure out what you want to do, <span className="text-brand-600">your way.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Tell us what you enjoy and how you like to work, then play with the results. Every match comes with the reasons behind it,
        so you can see what fits, what doesn&apos;t, and why.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/quiz" className="rounded-xl bg-brand-600 px-6 py-3 text-lg font-medium text-white hover:bg-brand-700">
          Take the quiz
        </Link>
        <Link href="/sandbox" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-lg font-medium hover:border-brand-500">
          Jump into the sandbox
        </Link>
      </div>
      <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4">
        {[
          [String(careerCount), "careers to explore"],
          ["3", "ways to rank them"],
          ["0", "sign-ups needed"],
        ].map(([n, label]) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="text-3xl font-bold text-brand-700">{n}</dd>
            <dd className="text-sm text-slate-500">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
