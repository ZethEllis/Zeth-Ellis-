"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { decodeAnswers } from "@/lib/matching";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
