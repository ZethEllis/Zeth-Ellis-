export default function ResultSection({
  title, description, children,
}: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mb-3 mt-1 text-sm text-slate-600">{description}</p>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
