import Link from "next/link";
import { notFound } from "next/navigation";
import CareerFacts from "@/components/CareerFacts";
import JobPostings from "@/components/JobPostings";
import SaveOrSignIn from "@/components/SaveOrSignIn";
import SkillTags from "@/components/SkillTags";
import TrainingPrograms from "@/components/TrainingPrograms";
import { getCareer } from "@/lib/careers";
import { getJobPostings, getPrograms } from "@/lib/opportunities";
import { getSavedSlugs, getUserId } from "@/lib/user";

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();

  const [userId, jobs, programs] = await Promise.all([getUserId(), getJobPostings(slug), getPrograms(slug)]);
  const saved = userId ? (await getSavedSlugs()).has(slug) : false;

  return (
    <article>
      <Link href="/sandbox" className="text-sm text-slate-500 hover:text-slate-900">← Back to sandbox</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{career.title}</h1>
        <SaveOrSignIn slug={slug} saved={saved} canSave={!!userId} />
      </div>
      <p className="mt-3 text-lg text-slate-600">{career.summary}</p>
      <CareerFacts career={career} />
      <SkillTags skills={career.skills} />
      <TrainingPrograms programs={programs} />
      <JobPostings jobs={jobs} />
      <Link href={`/compare?c=${slug}`} className="mt-8 inline-block rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium hover:border-brand-500">
        Compare with other careers
      </Link>
    </article>
  );
}
