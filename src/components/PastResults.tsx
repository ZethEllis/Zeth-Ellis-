import Link from "next/link";

export default function PastResults({ results }: { results: { id: string; code: string; created_at: string }[] }) {
  if (!results.length) return null;
  return (
    <>
      <h2 className="mt-10 text-xl font-semibold">Past quiz results</h2>
      <ul className="mt-3 grid gap-2">
        {results.map((r) => (
          <li key={r.id}>
            <Link href={`/results?r=${r.code}`} className="text-brand-600 hover:underline">
              {new Date(r.created_at).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
