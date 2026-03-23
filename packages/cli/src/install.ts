import { execa } from "execa";
import { spinner } from "@clack/prompts";

export async function install(pm: string, cwd: string) {
  const s = spinner();
  s.start(`Installing dependencies with ${pm}...`);
  try {
    if (pm === "bun") await execa("bun", ["install"], { cwd });
    else if (pm === "pnpm") await execa("pnpm", ["install"], { cwd });
    else await execa("yarn", [], { cwd });
    s.stop("Dependencies installed.");
  } catch {
    s.stop("Install failed. Run install manually.");
  }
}
