import OptionButton from "./OptionButton";

export interface Option { value: number; label: string; hint?: string }

export default function QuestionCard({
  title, options, disabled, onSelect,
}: { title: string; options: Option[]; disabled?: boolean; onSelect: (value: number) => void }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      <div className="grid gap-2">
        {options.map((o) => (
          <OptionButton key={o.value} label={o.label} hint={o.hint} disabled={disabled} onClick={() => onSelect(o.value)} />
        ))}
      </div>
    </>
  );
}
