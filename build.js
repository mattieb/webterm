import * as esbuild from "esbuild";
import { mkdir, copyFile } from "fs/promises";
import ts from "typescript";

await mkdir("app", { recursive: true });
await mkdir("lib", { recursive: true });

function checkTypeScriptDiagnostics(diagnostics) {
  if (diagnostics.length) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      })
    );
  }
}

// Compile TypeScript files
const configPath = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");
if (typeof configPath == "undefined") {
  throw new Error("Could not find tsconfig.json");
}

// Parse tsconfig.json
const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
  config,
  ts.sys,
  "./"
);

// Check for config parsing errors
checkTypeScriptDiagnostics(errors);

// Create and build the program
const program = ts.createProgram(fileNames, options);
const emitResult = program.emit();

// Check for compilation errors
checkTypeScriptDiagnostics(
  ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
);

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
