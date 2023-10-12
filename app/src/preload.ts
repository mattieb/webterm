import { TerminalDimensions } from "./common/types";
import { contextBridge, ipcRenderer } from "electron";

const api = {
  onData: (handler: (data: string) => void) =>
    ipcRenderer.on("output", (_, data) => handler(data)),
  onExit: (handler: () => void) => ipcRenderer.on("exit", () => handler()),
  onReady: (handler: () => void) => ipcRenderer.on("ready", () => handler()),
  resize: (dimensions: TerminalDimensions) =>
    ipcRenderer.send("resize", dimensions.cols, dimensions.rows),
  data: (data: string) => ipcRenderer.send("input", data),
};

export type MainApi = typeof api;

contextBridge.exposeInMainWorld("main", api);
