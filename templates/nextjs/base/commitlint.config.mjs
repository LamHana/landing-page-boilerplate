/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allowed commit types
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // documentation only
        "style", // formatting, whitespace
        "refactor", // code change that's not feat or fix
        "perf", // performance improvement
        "test", // tests
        "build", // build system, deps
        "ci", // CI/CD
        "chore", // other changes
        "revert", // revert a commit
      ],
    ],
    // Subject line max length
    "subject-max-length": [2, "always", 100],
    // No period at end of subject
    "subject-full-stop": [2, "never", "."],
    // Subject must start lowercase
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
  },
};

export default config;
