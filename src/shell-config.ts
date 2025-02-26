import path, { basename } from "node:path";
import { osLocale } from "os-locale";
import fs from "node:fs/promises";
import { isUndefined } from "./is-undefined.js";

const POWERSHELL_PATHS = [
  { env: "ProgramFiles", path: ["PowerShell", "7", "pwsh.exe"] },
  { env: "ProgramFiles(x86)", path: ["PowerShell", "7", "pwsh.exe"] },
  { env: "LOCALAPPDATA", path: ["Microsoft", "PowerShell", "7", "pwsh.exe"] },
  {
    env: "SystemRoot",
    path: ["System32", "WindowsPowerShell", "v1.0", "powershell.exe"],
  },
  {
    env: "SystemRoot",
    path: ["SysWOW64", "WindowsPowerShell", "v1.0", "powershell.exe"],
  },
];

const locale = async () => (await osLocale()).replace("-", "_");

const findPowerShell = async () => {
  for (const powerShellPath of POWERSHELL_PATHS) {
    const prefix = process.env[powerShellPath.env];
    if (!isUndefined(prefix)) {
      const candidate = path.join(prefix, ...powerShellPath.path);
      try {
        await fs.access(candidate, fs.constants.R_OK);
        return candidate;
      } catch {}
    }
  }

  throw new Error("could not find PowerShell");
};

export const getShellConfig = async () => {
  const file =
    process.env["SHELL"] ??
    (process.platform == "win32" ? await findPowerShell() : "/bin/sh");

  const argv0 = process.platform == "win32" ? file : `-${basename(file)}`;

  const env = { LANG: `${await locale()}.UTF-8` };

  return { file, argv0, env };
};
