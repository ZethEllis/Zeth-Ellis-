import CareerCard from "./CareerCard";
import type { Career } from "@/lib/types";

export default function CareerList({
  items, saved, canSave,
}: { items: (Career & { score?: number })[]; saved: Set<string>; canSave: boolean }) {
  return (
    <div className="mt-6 grid gap-4">
      {items.map((c) => (
        <CareerCard key={c.slug} career={c} score={c.score} saved={saved.has(c.slug)} canSave={canSave} />
      ))}
    </div>
  );
}
