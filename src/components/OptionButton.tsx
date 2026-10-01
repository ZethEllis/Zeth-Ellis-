export default function OptionButton({
  label, hint, disabled, onClick,
}: { label: string; hint?: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-brand-500 hover:bg-brand-50 disabled:opacity-50"
    >
      <div className={hint ? "font-medium" : ""}>{label}</div>
      {hint && <div className="text-sm text-slate-500">{hint}</div>}
    </button>
  );
}
