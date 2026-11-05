import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/clean-cards.ts",
      formats: ["es"],
      fileName: () => "clean-cards.js",
    },
  },
});
