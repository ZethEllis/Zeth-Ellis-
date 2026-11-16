import type { MetadataRoute } from "next";

/** Lets phones install Career E-Sandbox to the home screen as an app. Served at /manifest.webmanifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Career E-Sandbox",
    short_name: "E-Sandbox",
    description: "Explore careers, see why each one fits, and compare them side by side.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#e3eeff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
