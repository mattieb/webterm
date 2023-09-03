import { TerminalDimensions } from "../common/types";
import { getShellConfig } from "./shell-config";
import { BrowserWindow } from "electron";
import { spawn } from "node-pty";
import path from "node:path";

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
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  window.webContents.on("dom-ready", () => {
    window.show();

    const shellConfig = getShellConfig();
    const pty = spawn(shellConfig.file, [], {
      argv0: shellConfig.argv0,
      cwd: process.env.HOME ?? "/",
      env: { ...process.env, ...shellConfig.env },
      name: "xterm-256color",
    });

    pty.onData((data) => window.webContents.send("data", data));
    pty.onExit(() => {
      console.info(`pid ${pty.pid}: exited`);
      window.webContents.send("exit");
    });

    window.webContents.ipc.on(
      "resize",
      (_, { cols, rows }: TerminalDimensions) => {
        pty.resize(cols, rows);
      },
    );

    window.webContents.ipc.on("data", (_, data: string) => {
      pty.write(data);
    });

    window.on("close", () => {
      console.info(`pid ${pty.pid}: killing due to window close`);
      pty.kill();
    });

    window.webContents.send("ready");
  });
};
