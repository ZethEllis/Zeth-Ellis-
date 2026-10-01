import { createClient } from "@/lib/supabase/server";

export async function getUserId(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  return (await supabase.auth.getUser()).data.user?.id ?? null;
}

export async function getSavedSlugs(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("saved_careers").select("career_slug");
  return new Set((data ?? []).map((r) => r.career_slug as string));
}
