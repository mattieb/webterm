import { buildBrowserWindowDispatcher } from "./browser-window-dispatcher";
import { getShellConfig } from "./shell-config";
import { BrowserWindow } from "electron";
import path from "node:path";
import { buildTerminalBridge, newSession } from "webterm-core";

export const newWindow = () => {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1092,
    height: 732,
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  window.webContents.on("dom-ready", async () => {
    window.show();
    const dispatcher = buildBrowserWindowDispatcher(window);
    const terminal = buildTerminalBridge(dispatcher);
    const shellConfig = await getShellConfig();
    newSession(
      terminal,
      shellConfig.file,
      [],
      {
        argv0: shellConfig.argv0,
        cwd: process.env.HOME ?? "/",
        env: { ...process.env, ...shellConfig.env },
        name: "xterm-256color",
      },
      console.info,
    );
  });
};
