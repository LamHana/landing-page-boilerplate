import nextConfig from "eslint-config-next";

// Extract @typescript-eslint plugin already loaded by nextConfig (avoids duplicate import)
const tsPlugin = nextConfig.find((c) => c.plugins?.["@typescript-eslint"])?.plugins["@typescript-eslint"];

const eslintConfig = [
  ...nextConfig,
  {
    ...(tsPlugin && { plugins: { "@typescript-eslint": tsPlugin } }),
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
