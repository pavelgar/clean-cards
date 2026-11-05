import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-config-prettier"
import { configs as lit } from "eslint-plugin-lit"
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths"
import { configs as wc } from "eslint-plugin-wc"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["dist", "dev/ha"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  lit["flat/recommended"],
  wc["flat/recommended"],
  {
    settings: { wc: { elementBaseClasses: ["LitElement"] } },
  },
  {
    // Import from src/ as `@/…`, never `./` or `../` (`eslint --fix` rewrites them).
    files: ["src/**/*.ts"],
    plugins: { "no-relative-import-paths": noRelativeImportPaths },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { rootDir: "src", prefix: "@" },
      ],
    },
  },
  {
    // Copied from the Home Assistant frontend; keep it as close to the source as we can.
    files: ["src/ha/**/*.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  prettier,
])
