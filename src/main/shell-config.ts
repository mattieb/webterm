import { basename } from 'node:path';

export const getShellConfig = () => {
  const file = process.env.SHELL ?? "/bin/sh";
  const argv0 = `-${basename(file)}`;
  const env = { LANG: "en_US.UTF-8 " };

  return { file, argv0, env };
};
