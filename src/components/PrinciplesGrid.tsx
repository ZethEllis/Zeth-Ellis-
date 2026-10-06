import Link from "next/link";
import { PRINCIPLES } from "@/data/principles";

export default function PrinciplesGrid() {
  return (
    <section className="mt-16">
      <h2 className="text-center text-2xl font-bold">Seven principles behind the sandbox</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
        Not a test, not a verdict — a place to explore, compare and question.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Link
            key={p.n}
            href={`/principles#principle-${p.n}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-500"
          >
            <div className="text-sm font-bold text-brand-600">Principle {p.n}</div>
            <h3 className="mt-1 font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{p.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
