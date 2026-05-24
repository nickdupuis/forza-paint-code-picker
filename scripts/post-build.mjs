import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, "..", "build", "client");

// Copy index.html to 404.html for SPA routing on GitHub Pages
fs.copyFileSync(
  path.join(buildDir, "index.html"),
  path.join(buildDir, "404.html")
);

// Create .nojekyll to prevent GitHub Pages from ignoring _-prefixed files
fs.writeFileSync(path.join(buildDir, ".nojekyll"), "");

console.log("Post-build: created 404.html and .nojekyll");
