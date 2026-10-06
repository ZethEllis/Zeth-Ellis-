import Sandbox from "@/components/Sandbox";
import { getCareers } from "@/lib/careers";
import { decodeAnswers, scoreAnswers } from "@/lib/matching";
import { getSavedSlugs, getUserId } from "@/lib/user";

export const metadata = { title: "Your sandbox — Career E-Sandbox" };

export default async function SandboxPage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams;
  const decoded = decodeAnswers(r);
  const userId = await getUserId();
  const [careers, saved] = await Promise.all([getCareers(), userId ? getSavedSlugs() : Promise.resolve(new Set<string>())]);

  return (
    <Sandbox
      careers={careers}
      seed={decoded ? scoreAnswers(decoded.answers) : undefined}
      seedTraining={decoded?.training}
      canSave={!!userId}
      savedSlugs={[...saved]}
    />
  );
}
