import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Turbopack necesita la raíz explícita del repositorio: sin esto sube a
// carpetas de usuario fuera del repo y pierde el package-lock.json.
const raizRepo = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: raizRepo,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;