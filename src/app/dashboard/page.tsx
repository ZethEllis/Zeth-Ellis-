import CareerList from "@/components/CareerList";
import EmptyShortlist from "@/components/EmptyShortlist";
import PastResults from "@/components/PastResults";
import { getCareers } from "@/lib/careers";
import { createClient } from "@/lib/supabase/server";
import { getSavedSlugs } from "@/lib/user";

export const metadata = { title: "My shortlist — Career Compass" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const [saved, careers, { data: results }] = await Promise.all([
    getSavedSlugs(),
    getCareers(),
    supabase.from("quiz_results").select("id, code, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const shortlist = careers.filter((c) => saved.has(c.slug));

  return (
    <div>
      <h1 className="text-3xl font-bold">My shortlist</h1>
      {shortlist.length ? <CareerList items={shortlist} saved={saved} canSave /> : <EmptyShortlist />}
      <PastResults results={results ?? []} />
    </div>
  );
}
