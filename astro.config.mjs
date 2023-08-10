import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    AstroPWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#7611a6",
        background_color: "#f7f7f7",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "Stefan Gogov's Portfolio",
        short_name: "Stefan Gogov",
        description: "A portfolio website for Stefan Gogov",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
