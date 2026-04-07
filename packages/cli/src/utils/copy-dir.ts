import fs from "fs";
import path from "path";

// Recursively copy src directory to dest, skipping node_modules.
// overwrite=false: base template takes priority (default for base copy)
// overwrite=true: src takes priority (used for optional feature files)
export async function copyDir(src: string, dest: string, overwrite = false) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, overwrite);
    } else {
      // npm strips .gitignore from published packages; store as _gitignore and restore on copy
      const destName = entry.name === "_gitignore" ? ".gitignore" : entry.name;
      const destFile = path.join(dest, destName);
      if (overwrite || !fs.existsSync(destFile)) {
        fs.copyFileSync(srcPath, destFile);
      }
    }
  }
}
