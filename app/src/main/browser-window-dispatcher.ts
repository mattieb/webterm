import { BrowserWindow } from "electron";
import { IDispatcher } from "webterm-core";

export const buildBrowserWindowDispatcher = (
  window: BrowserWindow,
): IDispatcher => ({
  on: (channel: string, listener: (...args: any[]) => void) => {
    if (channel === "close") {
      window.on("close", () => listener());
      return;
    }
    window.webContents.ipc.on(channel, (_: any, ...args: any[]) => {
      listener(...args);
    });
  },

  send: (channel: string, ...args: any[]) => {
    window.webContents.send(channel, ...args);
  },
});
