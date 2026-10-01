export default function ResultsHeader({ traits }: { traits: string[] }) {
  return (
    <header>
      <h1 className="text-3xl font-bold">Your top matches</h1>
      <p className="mt-2 text-slate-600">
        You lean toward <strong>{traits.join(", ")}</strong> work. Here are the careers that fit best.
      </p>
    </header>
  );
}
