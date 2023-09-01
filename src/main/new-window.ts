import { BrowserWindow } from "electron";
import path from "node:path";
import { storePty } from "./ptys";
import { spawn } from "node-pty";
import { getShellConfig } from "./shell-config";

export const newWindow = () => {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  window.webContents.on("dom-ready", () => {
    window.show();

    const shellConfig = getShellConfig();
    const pty = spawn(shellConfig.file, [], {
      name: "xterm-256color",
      env: { ...process.env, ...shellConfig.env },
      argv0: shellConfig.argv0
    });

    pty.onData((data) => window.webContents.send("data", data));
    pty.onExit(() => window.webContents.send("exit"));

    storePty(window.webContents, pty);

    window.webContents.send("ready");
  });
};
