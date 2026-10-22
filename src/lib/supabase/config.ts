export const supabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";

/** The public client key. Supabase now calls it the "publishable" key; older projects call it the "anon" key. */
export const supabaseAnonKey = () =>
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim() ?? "";

/** True only when the Supabase URL and key are present and the URL is valid. Lets the app run (without auth) on a bad/missing config. */
export function isSupabaseConfigured(): boolean {
  const url = supabaseUrl();
  if (!url || !supabaseAnonKey()) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
