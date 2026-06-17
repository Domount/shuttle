import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/** @param {{ ignores?: string[] }} [options] */
export function createLoomEslintConfig(options = {}) {
  return tseslint.config(
    {
      ignores: [
        "**/dist/**",
        "**/node_modules/**",
        "**/*.test.js",
        "web/vite.config.ts",
        ...(options.ignores ?? []),
      ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files: ["web/src/**/*.{ts,tsx}"],
      languageOptions: {
        ecmaVersion: 2022,
        globals: globals.browser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        "react-hooks/set-state-in-effect": "off",
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      },
    },
    {
      files: ["server/src/**/*.js", "shared/**/*.js", "scripts/**/*.mjs"],
      languageOptions: {
        ecmaVersion: 2022,
        globals: globals.node,
        sourceType: "module",
      },
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  );
}

export default createLoomEslintConfig();
