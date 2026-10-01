import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Not sure what&apos;s next? <span className="text-brand-600">Let&apos;s narrow it down.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Career Compass turns “I have no idea” into a short list of careers worth exploring — in about three minutes.
      </p>
      <Link
        href="/quiz"
        className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 text-lg font-medium text-white hover:bg-brand-700"
      >
        Start the quiz
      </Link>
    </section>
  );
}
