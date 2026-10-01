import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function getUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    return (await supabase.auth.getUser()).data.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function getSavedSlugs(): Promise<Set<string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("saved_careers").select("career_slug");
    return new Set((data ?? []).map((r) => r.career_slug as string));
  } catch {
    return new Set();
  }
}
