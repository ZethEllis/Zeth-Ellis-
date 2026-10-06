import { redirect } from "next/navigation";

// Results now live in the sandbox; keep old links working.
export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams;
  redirect(r ? `/sandbox?r=${encodeURIComponent(r)}` : "/sandbox");
}
