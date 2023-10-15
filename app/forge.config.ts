import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { cp, rm } from "node:fs/promises";

const config: ForgeConfig = {
  packagerConfig: {
    icon: "icon/webterm",
  },
  rebuildConfig: {},
  makers: [new MakerZIP({}, ["darwin"])],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.ts",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts",
        },
      ],
    }),
  ],
  hooks: {
    prePackage: async (config, packageResult) => {
      // packaging looks for dependencies in local node_modules
      try {
        await rm("./node_modules", { recursive: true });
      } catch {}
      await cp("../node_modules", "./node_modules", {
        recursive: true,
        force: false,
      });
    },
  },
};

export default config;
