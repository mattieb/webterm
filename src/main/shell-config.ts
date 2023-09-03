import { basename } from "node:path";
import { osLocale } from "os-locale";

const locale = async () => (await osLocale()).replace("-", "_");

export const getShellConfig = async () => {
  const file = process.env.SHELL ?? "/bin/sh";
  const argv0 = `-${basename(file)}`;
  const env = { LANG: `${await locale()}.UTF-8` };

  return { file, argv0, env };
};
