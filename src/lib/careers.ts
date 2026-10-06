import { CAREERS } from "@/data/careers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Career } from "./types";

/** Older DB rows may lack the newer columns; fill them from the bundled data. */
function withDefaults(row: Career): Career {
  const bundled = CAREERS.find((c) => c.slug === row.slug);
  return {
    ...row,
    prefs: row.prefs ?? bundled?.prefs ?? { independence: 0.5, social: 0.5, creativity: 0.5, stability: 0.5, income: 0.5 },
    outlook_score: bundled && row.outlook_score === 0.5 ? bundled.outlook_score : row.outlook_score ?? 0.5,
  };
}

/** Reads careers from Supabase; falls back to bundled data if Supabase isn't configured or is empty. */
export async function getCareers(): Promise<Career[]> {
  if (!isSupabaseConfigured()) return CAREERS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("careers").select("*");
    if (error || !data?.length) return CAREERS;
    return (data as Career[]).map(withDefaults);
  } catch {
    return CAREERS;
  }
}

export async function getCareer(slug: string): Promise<Career | undefined> {
  return (await getCareers()).find((c) => c.slug === slug);
}
