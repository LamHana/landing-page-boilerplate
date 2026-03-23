import fs from "fs";
import path from "path";
// Recursively copy src directory to dest, skipping node_modules.
// overwrite=false: base template takes priority (default for base copy)
// overwrite=true: src takes priority (used for optional feature files)
export async function copyDir(src, dest, overwrite = false) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        if (entry.name === "node_modules")
            continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath, overwrite);
        }
        else {
            if (overwrite || !fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}
