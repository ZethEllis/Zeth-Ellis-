import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Career E-Sandbox — explore careers, don’t take a test",
  description: "An environment for exploring career possibilities: experiment, compare perspectives, question recommendations and learn about yourself.",
  applicationName: "Career E-Sandbox",
  // iPhone "Add to Home Screen": open full screen with its own name, like an app
  appleWebApp: { capable: true, title: "E-Sandbox", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="py-10 text-center text-sm text-slate-500">
          Career E-Sandbox — a starting point, not a verdict.
        </footer>
      </body>
    </html>
  );
}
