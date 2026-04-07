import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforce no unused variables — common source of tech debt
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // No explicit any — forces proper typing
      "@typescript-eslint/no-explicit-any": "warn",
      // React hooks rules
      "react-hooks/exhaustive-deps": "warn",
      // Allow raw <img> elements — Next.js Image optimization is opt-in
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
