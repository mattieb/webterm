import path, { basename } from "node:path";
import { osLocale } from "os-locale";
import fs from "node:fs/promises";
import { isUndefined } from "../shared/is-undefined.js";

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

export const getWindowsShell = async () => {
  const file = process.env["SHELL"] ?? await findPowerShell();
  const argv0 = file;
  return { file, argv0 };
};

export const getUnixShell = async () => {
  const file = process.env["SHELL"] ?? "/bin/sh";
  const argv0 = `-${basename(file)}`;
  return { file, argv0 };
};

const locale = async () => (await osLocale()).replace("-", "_");

export const getShellConfig = async () => {
  const shell = process.platform === "win32"
    ? await getWindowsShell()
    : await getUnixShell();
    
  const env = { LANG: `${await locale()}.UTF-8` };
  
  return { ...shell, env };
};
