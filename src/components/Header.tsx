import Link from "next/link";
import Logo from "./Logo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/actions";

async function getEmail(): Promise<string | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  try {
    const supabase = await createClient();
    return (await supabase.auth.getUser()).data.user?.email;
  } catch {
    return undefined; // a Supabase hiccup must not take the whole page down
  }
}

export default async function Header() {
  const email = await getEmail();

  return (
    <header className="sticky top-0 z-10 border-b border-brand-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Career E-Sandbox home" className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900">
          <Logo size={28} />
          <span className="hidden sm:inline">Career <span className="text-brand-600">E-Sandbox</span></span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/sandbox" className="hover:text-brand-600">Sandbox</Link>
          <Link href="/compare" className="hover:text-brand-600">Compare</Link>
          <Link href="/quiz" className="hover:text-brand-600">Quiz</Link>
          {email ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-600">My shortlist</Link>
              <form action={signOut}>
                <button className="text-slate-500 hover:text-slate-900">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="whitespace-nowrap rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
