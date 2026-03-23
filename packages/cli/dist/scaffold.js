import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { copyDir } from "./utils/copy-dir.js";
import { mergeJson } from "./utils/merge-json.js";
// Resolve templates root relative to this file (ESM-compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// When installed from npm, templates are bundled at ../templates (prepublishOnly copies them).
// In local monorepo dev, templates live at ../../../templates.
const _npmTemplates = path.resolve(__dirname, "../templates/nextjs");
const _devTemplates = path.resolve(__dirname, "../../../templates/nextjs");
const TEMPLATES_ROOT = fs.existsSync(_npmTemplates) ? _npmTemplates : _devTemplates;
export async function scaffold(config, targetDir) {
    fs.mkdirSync(targetDir, { recursive: true });
    // 1. Copy base template
    await copyDir(path.join(TEMPLATES_ROOT, "base"), targetDir);
    // 2. Build list of optional features to apply
    // ORDERING MATTERS: i18n-dict must run before any section inject that targets
    // app/[lang]/page.tsx — that file is created by i18n-dict, so sections injecting
    // into it must come after. Same logic applies to zustand/tanstack-query providers.
    const optionals = [];
    if (config.i18n === "dict")
        optionals.push("i18n-dict");
    if (config.stateManagement === "zustand")
        optionals.push("zustand");
    if (config.dataFetching === "tanstack-query")
        optionals.push("tanstack-query");
    // Sections run after i18n/state/data so their inject targets already exist
    optionals.push("sections/about");
    if (config.blog)
        optionals.push("sections/blog");
    if (config.docker)
        optionals.push("docker");
    // 3. Apply each optional feature (files + inject markers)
    for (const opt of optionals) {
        const optDir = path.join(TEMPLATES_ROOT, "optional", opt);
        if (fs.existsSync(optDir)) {
            await mergeOptional(optDir, targetDir);
        }
    }
    // 4. Apply Pila theme by default
    applyTheme("pila", targetDir);
    // 5. Replace __TOKEN__ placeholders in all text files
    replaceTokensInDir(targetDir, {
        __PROJECT_NAME__: config.projectName,
        __PACKAGE_MANAGER__: config.packageManager,
        __THEME__: "pila",
    });
    // 6. Remove leftover marker comments from all text files
    cleanupMarkersInDir(targetDir);
    // 7. Merge package.json fragments from optional features
    mergePackageJsonFragments(targetDir, optionals);
    // 8. Make husky scripts executable
    setupHusky(targetDir);
}
async function mergeOptional(optDir, targetDir) {
    // Copy new files from optional/files/ — optional files override base
    const filesDir = path.join(optDir, "files");
    if (fs.existsSync(filesDir)) {
        await copyDir(filesDir, targetDir, true);
    }
    // Inject code into base files via markers
    const injectDir = path.join(optDir, "inject");
    if (fs.existsSync(injectDir)) {
        for (const injectFile of fs.readdirSync(injectDir)) {
            const injectContent = fs.readFileSync(path.join(injectDir, injectFile), "utf8");
            // Filename encodes path: "components__providers.tsx" → "components/providers.tsx"
            const targetFile = path.join(targetDir, injectFile.replace(/__/g, "/"));
            if (fs.existsSync(targetFile)) {
                injectIntoMarkers(targetFile, injectContent);
            }
        }
    }
}
function injectIntoMarkers(filePath, injectContent) {
    // Format: "MARKER:__MARKER_NAME__\n<code>\n---\nMARKER:...\n<code>"
    let fileContent = fs.readFileSync(filePath, "utf8");
    const blocks = injectContent.split(/^---$/m);
    for (const block of blocks) {
        const markerMatch = block.match(/^MARKER:(\S+)\n([\s\S]*)/m);
        if (!markerMatch)
            continue;
        const [, marker, code] = markerMatch;
        // Insert before marker, keeping marker intact so subsequent sections can inject too
        fileContent = fileContent
            .replace(`{/* ${marker} */}`, `${code.trim()}\n{/* ${marker} */}`)
            .replace(`// ${marker}`, `${code.trim()}\n// ${marker}`);
    }
    fs.writeFileSync(filePath, fileContent);
}
function cleanupMarkersInDir(dir) {
    // Remove residual marker comment lines: "// __MARKER__" and "{/* __MARKER__ */}"
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "node_modules") {
            cleanupMarkersInDir(fullPath);
        }
        else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
            let content = fs.readFileSync(fullPath, "utf8");
            const cleaned = content
                .replace(/^\s*\/\/ __[A-Z_]+__\s*\n/gm, "")
                .replace(/^\s*\{\/\* __[A-Z_]+__ \*\/\}\s*\n/gm, "");
            if (cleaned !== content)
                fs.writeFileSync(fullPath, cleaned);
        }
    }
}
function applyTheme(theme, targetDir) {
    const themeFile = path.join(TEMPLATES_ROOT, "themes", `${theme}.css`);
    const targetTheme = path.join(targetDir, "styles", "theme.css");
    if (fs.existsSync(themeFile)) {
        fs.mkdirSync(path.dirname(targetTheme), { recursive: true });
        fs.copyFileSync(themeFile, targetTheme);
    }
}
function replaceTokensInDir(dir, tokens) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "node_modules") {
            replaceTokensInDir(fullPath, tokens);
        }
        else if (entry.isFile() && /\.(ts|tsx|json|css|md|env|sh|yml|yaml)$/.test(entry.name)) {
            let content = fs.readFileSync(fullPath, "utf8");
            for (const [token, value] of Object.entries(tokens)) {
                content = content.replaceAll(token, value);
            }
            fs.writeFileSync(fullPath, content);
        }
    }
}
function mergePackageJsonFragments(targetDir, optionals) {
    const basePkgPath = path.join(targetDir, "package.json");
    let basePkg = JSON.parse(fs.readFileSync(basePkgPath, "utf8"));
    for (const opt of optionals) {
        const fragPath = path.join(TEMPLATES_ROOT, "optional", opt, "pkg.json");
        if (fs.existsSync(fragPath)) {
            const fragment = JSON.parse(fs.readFileSync(fragPath, "utf8"));
            basePkg = mergeJson(basePkg, fragment);
        }
    }
    fs.writeFileSync(basePkgPath, JSON.stringify(basePkg, null, 2));
}
function setupHusky(targetDir) {
    // Make husky hook scripts and shell scripts executable before install runs
    const scripts = [
        ".husky/pre-commit",
        ".husky/commit-msg",
        ".husky/pre-push",
        "scripts/build-and-scan.sh",
        "scripts/lighthouse-check.sh",
    ];
    for (const script of scripts) {
        const fullPath = path.join(targetDir, script);
        if (fs.existsSync(fullPath)) {
            fs.chmodSync(fullPath, "755");
        }
    }
}
