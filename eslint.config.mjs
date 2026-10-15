import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["node_modules", "dist", "client"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      semi: ["error"],
      // Was a warning in typescript-eslint v4's recommended preset
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
