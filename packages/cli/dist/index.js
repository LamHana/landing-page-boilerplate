#!/usr/bin/env node
import { intro, outro, cancel } from "@clack/prompts";
import { bold, cyan } from "kolorist";
import { runPrompts } from "./prompts.js";
import { scaffold } from "./scaffold.js";
import { install } from "./install.js";
import path from "path";
async function main() {
    console.log();
    intro(`${bold(cyan("create-landing-app"))} — Next.js landing page scaffold`);
    const config = await runPrompts();
    if (!config) {
        cancel("Cancelled.");
        process.exit(0);
    }
    const targetDir = path.resolve(process.cwd(), config.projectName);
    await scaffold(config, targetDir);
    await install(config.packageManager, targetDir);
    outro(`Done! cd ${config.projectName} && ${config.packageManager} dev`);
}
main().catch((e) => { console.error(e); process.exit(1); });
