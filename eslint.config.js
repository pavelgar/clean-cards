import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import { configs as lit } from "eslint-plugin-lit";
import { configs as wc } from "eslint-plugin-wc";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "dev/ha"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  lit["flat/recommended"],
  wc["flat/recommended"],
  {
    settings: { wc: { elementBaseClasses: ["LitElement"] } },
  },
  prettier,
]);
