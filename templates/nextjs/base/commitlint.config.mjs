/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Downgrade type/subject requirements to warnings only
    "type-empty": [1, "never"],
    "subject-empty": [1, "never"],
    "type-enum": [1, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"]],
    // Only hard rules: keep messages readable
    "subject-max-length": [2, "always", 100],
    "subject-full-stop": [2, "never", "."],
    "subject-case": [0],
  },
};

export default config;
