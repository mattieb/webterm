import { contextBridge, ipcRenderer } from "electron";
import { TerminalDimensions } from "./common/types";

const api = {
  onData: (handler: (data: string) => void) =>
    ipcRenderer.on("data", (_, data) => handler(data)),
  onExit: (handler: () => void) => ipcRenderer.on("exit", () => handler()),
  onReady: (handler: () => void) => ipcRenderer.on("ready", () => handler()),
  resize: (dimensions: TerminalDimensions) =>
    ipcRenderer.send("resize", dimensions),
  data: (data: string) => ipcRenderer.send("data", data),
};

export type MainApi = typeof api;

contextBridge.exposeInMainWorld("main", api);
