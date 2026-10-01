import { CAREERS } from "@/data/careers";
import { createClient } from "@/lib/supabase/server";
import type { Career } from "./types";

/** Reads careers from Supabase; falls back to bundled data if Supabase isn't configured or is empty. */
export async function getCareers(): Promise<Career[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return CAREERS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("careers").select("*");
    if (error || !data?.length) return CAREERS;
    return data as Career[];
  } catch {
    return CAREERS;
  }
}

export async function getCareer(slug: string): Promise<Career | undefined> {
  return (await getCareers()).find((c) => c.slug === slug);
}
