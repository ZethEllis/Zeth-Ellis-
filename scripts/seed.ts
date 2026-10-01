import { createClient } from "@supabase/supabase-js";
import { CAREERS } from "../src/data/careers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");

const supabase = createClient(url, key);
const { error } = await supabase.from("careers").upsert(CAREERS, { onConflict: "slug" });
if (error) throw error;
console.log(`Seeded ${CAREERS.length} careers.`);
