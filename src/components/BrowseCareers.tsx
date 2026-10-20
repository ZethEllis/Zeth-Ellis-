import Link from "next/link";
import type { Career } from "@/lib/types";

export default function BrowseCareers({ careers }: { careers: Career[] }) {
  const sorted = [...careers].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <section className="mt-16">
      <h2 className="text-center text-2xl font-bold">Browse every career</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
        Already curious about one? Open it for pay, training and outlook, or put a few side by side.
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {sorted.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/careers/${c.slug}`}
              className="block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm transition hover:border-brand-500 hover:text-brand-700"
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <Link href="/compare" className="font-medium text-brand-600 hover:underline">Compare careers side by side →</Link>
      </div>
    </section>
  );
}
