import Link from "next/link";
import { redirect } from "next/navigation";
import CareerList from "@/components/CareerList";
import ResultsHeader from "@/components/ResultsHeader";
import { getCareers } from "@/lib/careers";
import { decodeAnswers, matchCareers, scoreAnswers, topTraits } from "@/lib/matching";
import { getSavedSlugs, getUserId } from "@/lib/user";

export const metadata = { title: "Your results — Career Compass" };

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams;
  const decoded = decodeAnswers(r);
  if (!decoded) redirect("/quiz");

  const profile = scoreAnswers(decoded.answers);
  const matches = matchCareers(profile, decoded.training, await getCareers());
  const userId = await getUserId();
  const saved = userId ? await getSavedSlugs() : new Set<string>();

  return (
    <div>
      <ResultsHeader traits={topTraits(profile)} />
      <CareerList items={matches.slice(0, 6)} saved={saved} canSave={!!userId} />
      <Link href="/quiz" className="mt-8 inline-block text-brand-600 hover:underline">Retake the quiz</Link>
    </div>
  );
}
