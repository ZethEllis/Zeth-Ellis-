"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { decodeAnswers } from "@/lib/matching";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { askGemini, isAiConfigured } from "@/lib/ai";
import { getCareer } from "@/lib/careers";
import { getJobPostings, getPrograms } from "@/lib/opportunities";
import { getUserId } from "@/lib/user";

export async function saveResult(code: string) {
  if (!decodeAnswers(code) || !isSupabaseConfigured()) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("quiz_results").insert({ user_id: user.id, code });
}

export async function toggleSaveCareer(slug: string, saved: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (saved) {
    await supabase.from("saved_careers").delete().eq("user_id", user.id).eq("career_slug", slug);
  } else {
    await supabase.from("saved_careers").upsert({ user_id: user.id, career_slug: slug });
  }
  revalidatePath("/dashboard");
  revalidatePath("/results");
  revalidatePath(`/careers/${slug}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export type AiCompareResult = { text: string } | { error: string };

/** Asks Gemini to compare 2–3 careers in plain language, using the careers, programs and job postings in the database. Signed-in users only. */
export async function compareWithAI(slugs: string[]): Promise<AiCompareResult> {
  if (!isAiConfigured()) return { error: "The AI isn't set up yet." };
  if (!(await getUserId())) return { error: "Sign in to get an AI comparison." };
  const careers = (await Promise.all(slugs.slice(0, 3).map(getCareer))).filter((c) => c !== undefined);
  if (careers.length < 2) return { error: "Pick at least two careers to compare." };

  const facts = await Promise.all(
    careers.map(async (c) => {
      const [jobs, programs] = await Promise.all([getJobPostings(c.slug), getPrograms(c.slug)]);
      return [
        `## ${c.title}`,
        `Summary: ${c.summary}`,
        `Pay: ${c.salary_range}. Education: ${c.education}. Outlook: ${c.outlook}.`,
        `Skills: ${c.skills.join(", ")}. Work settings: ${c.work_settings.join(", ")}.`,
        `Sample jobs: ${jobs.slice(0, 3).map((j) => `${j.title} ($${j.salary_min}-$${j.salary_max})`).join("; ") || "none"}.`,
        `Training: ${programs.slice(0, 2).map((p) => `${p.name}, ${p.length_months} months, $${p.tuition_per_year}/year`).join("; ") || "none"}.`,
      ].join("\n");
    }),
  );

  try {
    const text = await askGemini(
      "You help Canadian students explore careers. Compare the careers below in plain, friendly language for a high school or university student. " +
        "Use only the facts given. Cover pay, training time and cost, day-to-day work, and who each one suits. " +
        "Finish with one sentence on how to choose between them. Keep it under 220 words and use no headings.",
      facts.join("\n\n"),
    );
    return { text };
  } catch {
    return { error: "The AI couldn't answer right now. Try again in a moment." };
  }
}
