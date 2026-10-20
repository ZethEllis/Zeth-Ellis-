"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Mode = "link" | "password";
type Status = "idle" | "working" | "sent" | "error";

const NOT_CONFIGURED =
  "Sign-in isn't set up on this site yet: the Supabase URL and anon key are missing or invalid in the deployment's environment variables.";

const friendly = (message: string) =>
  /rate limit/i.test(message)
    ? "Too many sign-in emails were requested recently. Wait a few minutes and try again."
    : /invalid login credentials/i.test(message)
      ? "That email and password don't match. Check them, or create an account."
      : message;

const callbackUrl = () => `${window.location.origin}/auth/callback?next=/dashboard`;

function ProviderButton({ label, icon, onClick, disabled }: { label: string; icon: React.ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium hover:border-brand-500 disabled:opacity-50"
    >
      {icon}
      {label}
    </button>
  );
}

const GoogleIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
  </svg>
);

const GitHubIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      fill="currentColor"
      d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"
    />
  </svg>
);

type Provider = "google" | "github";

/** Asks Supabase which social providers are switched on, so buttons only show once they'll work. */
function useEnabledProviders(): Provider[] {
  const [enabled, setEnabled] = useState<Provider[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();
    fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { external?: Record<string, boolean> } | null) =>
        setEnabled((["google", "github"] as const).filter((p) => s?.external?.[p])))
      .catch(() => {});
  }, []);
  return enabled;
}

/** Sign in with Google, GitHub, an emailed link, or an email and password. */
export default function AuthForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const providers = useEnabledProviders();
  const [mode, setMode] = useState<Mode>("link");
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>(initialError ? "error" : "idle");
  const [message, setMessage] = useState(initialError ?? "");
  const [sentText, setSentText] = useState("");

  function fail(text: string) {
    setStatus("error");
    setMessage(friendly(text));
  }

  /** Runs a sign-in attempt with the shared configured/error handling. */
  async function attempt(run: (supabase: ReturnType<typeof createClient>) => Promise<void>) {
    setStatus("working");
    if (!isSupabaseConfigured()) return fail(NOT_CONFIGURED);
    try {
      await run(createClient());
    } catch (err) {
      fail(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const withProvider = (provider: Provider) =>
    attempt(async (supabase) => {
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: callbackUrl() } });
      if (error) fail(error.message); // on success the browser leaves for the provider's sign-in page
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    attempt(async (supabase) => {
      if (mode === "link") {
        const { error } = await supabase.auth.signInWithOtp({ email: address, options: { emailRedirectTo: callbackUrl() } });
        if (error) return fail(error.message);
        setSentText("for your sign-in link");
        setStatus("sent");
      } else if (creating) {
        const { data, error } = await supabase.auth.signUp({ email: address, password, options: { emailRedirectTo: callbackUrl() } });
        if (error) return fail(error.message);
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setSentText("to confirm your account, then come back and sign in");
          setStatus("sent");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: address, password });
        if (error) return fail(error.message);
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-green-50 p-4 text-green-800">
        <p>Check <strong>{email}</strong> {sentText}.</p>
        <p className="mt-1 text-sm">It can take a minute — and check your spam or junk folder.</p>
      </div>
    );
  }

  const busy = status === "working";
  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => { setMode(m); setStatus("idle"); }}
      aria-pressed={mode === m}
      className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium ${mode === m ? "bg-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid gap-5">
      {providers.length > 0 && (
        <>
          <div className="grid gap-3">
            {providers.includes("google") && (
              <ProviderButton label="Continue with Google" icon={GoogleIcon} onClick={() => withProvider("google")} disabled={busy} />
            )}
            {providers.includes("github") && (
              <ProviderButton label="Continue with GitHub" icon={GitHubIcon} onClick={() => withProvider("github")} disabled={busy} />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />or use your email<span className="h-px flex-1 bg-slate-200" />
          </div>
        </>
      )}

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {tab("link", "Email me a link")}
        {tab("password", "Use a password")}
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500"
        />
        {mode === "password" && (
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={creating ? "Choose a password (6+ characters)" : "Password"}
            aria-label="Password"
            autoComplete={creating ? "new-password" : "current-password"}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500"
          />
        )}
        <button disabled={busy} className="rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-50">
          {busy ? "One moment…" : mode === "link" ? "Email me a sign-in link" : creating ? "Create account" : "Sign in"}
        </button>
        {mode === "password" && (
          <button type="button" onClick={() => setCreating(!creating)} className="text-sm text-slate-500 hover:text-slate-900">
            {creating ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        )}
        {status === "error" && <p role="alert" className="text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}
