import * as esbuild from "esbuild";
import { execSync } from "child_process";
import { mkdir, copyFile } from "fs/promises";

await mkdir("app", { recursive: true });

execSync("npx -c tsc", { stdio: "inherit" });

await esbuild.build({
  entryPoints: ["lib/renderer.js"],
  bundle: true,
  format: "esm",
  outfile: "app/renderer.js",
});

await esbuild.build({
  entryPoints: ["lib/preload.js"],
  bundle: true,
  format: "cjs",
  platform: "node",
  packages: "external",
  outfile: "app/preload.js",
});

await esbuild.build({
  entryPoints: ["lib/main.js"],
  bundle: true,
  format: "esm",
  platform: "node",
  packages: "external",
  outfile: "app/main.js",
});

await esbuild.build({
  entryPoints: ["src/index.css"],
  bundle: true,
  outfile: "app/index.css",
});

await copyFile("src/index.html", "app/index.html");
