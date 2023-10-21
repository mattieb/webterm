import {
  KickstartContext,
  PackageInfo,
  Trigger,
  tsViteBuild,
  watchTree,
} from "turbotree";

const START = ["webterm-browser"];

const triggers = (p: PackageInfo): Trigger[] => {
  const build: Trigger = {
    expression: tsViteBuild(p),
    name: `${p.name}:build`,
    initialRun: false,
    onChange: async ({ spawn, files }) => {
      console.log(`${p.root}: changes detected: ${files.map((f) => f.name)}`);
      await spawn`npx turbo build --output-logs=new-only ${p.turboFilterFlags}`;
    },
  };

  const start: Trigger = {
    expression: ["dirname", "lib"],
    name: `${p.name}:start`,
    initialRun: true,
    interruptible: true,
    onChange: async ({ spawn }) => {
      await spawn`cd ${p.root} && npm start`;
    },
    persistent: true,
  };

  return START.includes(p.name) ? [build, start] : [build];
};

const kickstart = async (k: KickstartContext) =>
  k.$`npx turbo build --output-logs=new-only ${k.turboFilterFlags}`;

watchTree(__dirname, triggers, kickstart);
