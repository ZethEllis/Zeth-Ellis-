import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Career Compass — find a career that fits you",
  description: "Not sure what career is next? Answer a few questions and get a short list of paths worth exploring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="py-10 text-center text-sm text-slate-500">
          Career Compass — a starting point, not a verdict.
        </footer>
      </body>
    </html>
  );
}
