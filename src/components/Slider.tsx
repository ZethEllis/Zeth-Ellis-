"use client";

export default function Slider({
  label, value, onChange, low = "Not at all", high = "Very much", hint,
}: { label: string; value: number; onChange: (v: number) => void; low?: string; high?: string; hint?: string }) {
  const id = `slider-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <label htmlFor={id} className="font-medium">{label}</label>
        <span className="text-slate-500">{Math.round(value * 100)}</span>
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <input
        id={id}
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-brand-600"
      />
      <div className="flex justify-between text-xs text-slate-400"><span>{low}</span><span>{high}</span></div>
    </div>
  );
}
