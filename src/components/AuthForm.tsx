"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Passwordless email sign-in (magic link). */
export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return <p className="rounded-xl bg-green-50 p-4 text-green-800">Check {email} for your sign-in link.</p>;
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
      {status === "error" && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
