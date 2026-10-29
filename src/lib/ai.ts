const MODEL = () => process.env.OPENROUTER_MODEL?.trim() || "google/gemini-2.5-flash";

/** True when an OpenRouter key is set (in Vercel env vars or .env.local). */
export const isAiConfigured = () => Boolean(process.env.OPENROUTER_API_KEY?.trim());

/** Sends one prompt to Gemini through OpenRouter and returns the reply text. Throws on failure. */
export async function askGemini(system: string, prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY?.trim()}`,
      "Content-Type": "application/json",
      "X-Title": "Career E-Sandbox",
    },
    body: JSON.stringify({
      model: MODEL(),
      max_tokens: 700,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const data = await res.json();
  const text: string | undefined = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty reply");
  return text.trim();
}
