import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";

export default async function Header() {
  let email: string | undefined;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    email = (await supabase.auth.getUser()).data.user?.email;
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand-700">🧭 Career Compass</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/quiz" className="hover:text-brand-600">Take the quiz</Link>
          {email ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-600">My shortlist</Link>
              <form action={signOut}>
                <button className="text-slate-500 hover:text-slate-900">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
