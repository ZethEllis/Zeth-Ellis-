export default function StepCard({ n, title, description }: { n: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
        {n}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}
