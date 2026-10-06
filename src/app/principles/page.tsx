import Link from "next/link";
import { INTRO, PRINCIPLES } from "@/data/principles";

export const metadata = { title: "7 principles — Career E-Sandbox" };

export default function PrinciplesPage() {
  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">7 Principles for Building a Career E-Sandbox</h1>
      <div className="mt-4 grid gap-3 text-slate-600">
        {INTRO.map((p) => <p key={p}>{p}</p>)}
      </div>
      <div className="mt-10 grid gap-10">
        {PRINCIPLES.map((p) => (
          <section key={p.n} id={`principle-${p.n}`}>
            <h2 className="text-xl font-semibold"><span className="mr-2 text-brand-600">{p.n}.</span>{p.title}</h2>
            <div className="mt-3 grid gap-3 text-slate-700">
              {p.body.map((b) => <p key={b}>{b}</p>)}
            </div>
          </section>
        ))}
      </div>
      <Link href="/sandbox" className="mt-12 inline-block rounded-xl bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
        Try the sandbox
      </Link>
    </article>
  );
}
