import { defineConfig } from "vitest/config"

export default defineConfig({
  // `@/…` imports, from `paths` in tsconfig.json.
  resolve: {
    tsconfigPaths: true,
  },
  // `bun run dev` rebuilds dist/ on every change and serves it here, for the
  // local Home Assistant at localhost:8123 (Vite allows localhost origins by default).
  preview: {
    port: 4000,
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
