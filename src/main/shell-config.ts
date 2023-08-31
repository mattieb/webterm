export const getShellConfig = () => ({
  file: process.env.SHELL ?? "/bin/sh",
  args: ["--login"], // very optimistic, this
  env: { LANG: "en_US.UTF-8" },
});
