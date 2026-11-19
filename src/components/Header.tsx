import Link from "next/link";
import Logo from "./Logo";
import NavDropdown from "./NavDropdown";
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
      <nav className="relative mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Career E-Sandbox home" className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900">
          <Logo size={28} />
          <span className="hidden sm:inline">Career <span className="text-brand-600">E-Sandbox</span></span>
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <NavDropdown
            label="Explore"
            items={[
              { href: "/#browse", label: "Browse all careers", hint: "Pay, training and outlook" },
              { href: "/sandbox", label: "Career sandbox", hint: "Move sliders, see your matches" },
              { href: "/compare", label: "Compare careers", hint: "Side by side, with AI" },
            ]}
          />
          <NavDropdown
            label="Quiz"
            items={[
              { href: "/quiz", label: "Take the quiz", hint: "A few minutes, no account needed" },
              { href: "/#how-it-works", label: "How it works" },
            ]}
          />
          {email ? (
            <NavDropdown
              label="Account"
              align="right"
              items={[{ href: "/dashboard", label: "My shortlist", hint: "Saved careers and past results" }]}
              footer={
                <form action={signOut}>
                  <button className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                    Sign out
                  </button>
                </form>
              }
            />
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
