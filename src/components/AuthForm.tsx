"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Passwordless email sign-in (magic link). */
export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setMessage("Sign-in isn't set up on this site yet: the Supabase URL and anon key are missing or invalid in the deployment's environment variables.");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) {
        setStatus("error");
        setMessage(
          /rate limit/i.test(error.message)
            ? "Too many sign-in emails were requested recently. Wait a few minutes and try again."
            : error.message,
        );
      } else {
        setStatus("sent");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-green-50 p-4 text-green-800">
        <p>Check <strong>{email}</strong> for your sign-in link.</p>
        <p className="mt-1 text-sm">It can take a minute — and check your spam or junk folder.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500"
      />
      <button
        disabled={status === "sending"}
        className="rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
      {status === "error" && <p role="alert" className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
