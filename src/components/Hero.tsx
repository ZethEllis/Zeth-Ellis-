import Link from "next/link";
import Logo from "./Logo";

export default function Hero({ careerCount }: { careerCount: number }) {
  return (
    <section className="py-10 text-center sm:py-16">
      <div className="flex justify-center">
        <Logo size={64} />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        Find a career that fits <span className="text-brand-600">you.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
        Take a short quiz, explore {careerCount} careers, and see why each one matches. No sign-up needed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/quiz" className="rounded-xl bg-brand-600 px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-brand-700">
          Take the quiz
        </Link>
        <Link href="/sandbox" className="rounded-xl bg-white px-6 py-3 text-lg font-medium text-brand-700 shadow-sm hover:bg-brand-50">
          Explore the sandbox
        </Link>
      </div>
    </section>
  );
}
