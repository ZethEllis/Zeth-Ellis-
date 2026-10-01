export default function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mb-6 mt-2 text-slate-600">{subtitle}</p>}
    </>
  );
}
