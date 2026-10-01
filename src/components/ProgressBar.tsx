export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={Math.round(value * 100)}>
      <div className="h-full bg-brand-600 transition-all" style={{ width: `${value * 100}%` }} />
    </div>
  );
}
