import { BrowserWindow, screen, webContents } from "electron";
import path from "node:path";
import { isNull, isUndefined } from "webterm-core";
import { buildTerminalBridge, newSession } from "webterm-pty";
import { buildBrowserWindowDispatcher } from "./browser-window-dispatcher";
import { getShellConfig } from "./shell-config";

const getInitialPosition = () => {
  const cursor = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursor);

  const x = Math.round(
    currentDisplay.bounds.x +
      currentDisplay.workArea.width / 2 -
      INITIAL_SIZE.width / 2,
  );
  const y = Math.round(
    currentDisplay.bounds.y +
      currentDisplay.workArea.height / 2 -
      INITIAL_SIZE.height / 2,
  );
  return { x, y };
};

const getCurrentWindowBounds = () => {
  const current = webContents.getFocusedWebContents();
  if (isNull(current)) return;
  const window = BrowserWindow.fromWebContents(current);
  return window.getBounds();
};

const INITIAL_SIZE: Readonly<{ width: number; height: number }> = {
  width: 1092,
  height: 732,
};

const newWindowGeometry = () => {
  const currentBounds = getCurrentWindowBounds();

  if (isUndefined(currentBounds)) {
    return {
      ...getInitialPosition(),
      ...INITIAL_SIZE,
    };
  }

  return {
    x: currentBounds.x + 29,
    y: currentBounds.y + 29,
    width: currentBounds.width,
    height: currentBounds.height,
  };
};

export const newWindow = () => {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    ...newWindowGeometry(),
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
