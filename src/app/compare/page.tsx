import CompareView from "@/components/CompareView";
import { getCareers } from "@/lib/careers";

export const metadata = { title: "Compare careers — Career E-Sandbox" };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const careers = await getCareers();
  const known = new Set(careers.map((x) => x.slug));
  const initial = (c ?? "").split(",").filter((s) => known.has(s)).slice(0, 3);
  return <CompareView careers={careers} initial={initial} />;
}
