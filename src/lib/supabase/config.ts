/** True only when both Supabase env vars are present and the URL is valid. Lets the app run (without auth) on a bad/missing config. */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return false;
  try {
    return new URL(url).protocol === "https:" || new URL(url).protocol === "http:";
  } catch {
    return false;
  }
}
