import {
  text, select, confirm, isCancel
} from "@clack/prompts";

export interface UserConfig {
  projectName: string;
  packageManager: "bun" | "pnpm" | "yarn";
  i18n: "none" | "dict";
  stateManagement: "none" | "zustand";
  dataFetching: "none" | "tanstack-query";
  blog: boolean;
  docker: boolean;
}

export async function runPrompts(): Promise<UserConfig | null> {
  const projectName = await text({
    message: "Project name?",
    placeholder: "my-landing",
    validate: (v) => (v.trim().length === 0 ? "Required" : undefined),
  });
  if (isCancel(projectName)) return null;

  const packageManager = await select({
    message: "Package manager?",
    options: [
      { value: "bun", label: "bun" },
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
    ],
  });
  if (isCancel(packageManager)) return null;

  const i18n = await select({
    message: "i18n / Translation?",
    options: [
      { value: "none", label: "None" },
      { value: "dict", label: "Dictionary-based (no extra deps)" },
    ],
  });
  if (isCancel(i18n)) return null;

  const stateManagement = await select({
    message: "State management?",
    options: [
      { value: "none", label: "None (recommended for simple sites)" },
      { value: "zustand", label: "Zustand" },
    ],
  });
  if (isCancel(stateManagement)) return null;

  const dataFetching = await select({
    message: "Data fetching?",
    options: [
      { value: "none", label: "None" },
      { value: "tanstack-query", label: "TanStack Query" },
    ],
  });
  if (isCancel(dataFetching)) return null;

  const blog = await confirm({ message: "Include Blog section?" });
  if (isCancel(blog)) return null;

  const docker = await confirm({ message: "Include Docker setup? (for VPS deploy)" });
  if (isCancel(docker)) return null;

  return {
    projectName: String(projectName).trim(),
    packageManager: packageManager as UserConfig["packageManager"],
    i18n: i18n as UserConfig["i18n"],
    stateManagement: stateManagement as UserConfig["stateManagement"],
    dataFetching: dataFetching as UserConfig["dataFetching"],
    blog: Boolean(blog),
    docker: Boolean(docker),
  };
}
