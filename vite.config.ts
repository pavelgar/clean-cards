import { defineConfig } from "vitest/config"

export default defineConfig({
  // `@/…` imports, from `paths` in tsconfig.json.
  resolve: {
    tsconfigPaths: true,
  },
  // `bun run dev` serves src/ to the local Home Assistant at localhost:8123.
  // Vite's default CORS policy already allows localhost origins.
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    lib: {
      entry: "src/clean-cards.ts",
      formats: ["es"],
      fileName: () => "clean-cards.js",
    },
  },
  test: {
    environment: "happy-dom",
  },
})
