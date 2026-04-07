import {
  text, confirm, isCancel
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

  const blog = await confirm({ message: "Include Blog section?" });
  if (isCancel(blog)) return null;

  const docker = await confirm({ message: "Include Docker setup? (for VPS deploy)" });
  if (isCancel(docker)) return null;

  return {
    projectName: String(projectName).trim(),
    packageManager: "pnpm",
    i18n: "dict",
    stateManagement: "zustand",
    dataFetching: "tanstack-query",
    blog: Boolean(blog),
    docker: Boolean(docker),
  };
}
