import Link from "next/link";
import { notFound } from "next/navigation";
import CareerFacts from "@/components/CareerFacts";
import SaveOrSignIn from "@/components/SaveOrSignIn";
import SkillTags from "@/components/SkillTags";
import { getCareer } from "@/lib/careers";
import { getSavedSlugs, getUserId } from "@/lib/user";

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();

  const userId = await getUserId();
  const saved = userId ? (await getSavedSlugs()).has(slug) : false;

  return (
    <article>
      <Link href="/quiz" className="text-sm text-slate-500 hover:text-slate-900">← Back to quiz</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{career.title}</h1>
        <SaveOrSignIn slug={slug} saved={saved} canSave={!!userId} />
      </div>
      <p className="mt-3 text-lg text-slate-600">{career.summary}</p>
      <CareerFacts career={career} />
      <SkillTags skills={career.skills} />
    </article>
  );
}
