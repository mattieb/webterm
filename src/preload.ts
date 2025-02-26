import { contextBridge, ipcRenderer } from "electron";
import type { IDispatcher } from "./dispatcher.js";
import { buildPtyBridge } from "./pty-bridge.js";

const buildIpcRendererDispatcher = (): IDispatcher => ({
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_: any, ...args: any[]) => {
      listener(...args);
    });
  },

  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },
});

const ptyBridge = buildPtyBridge(buildIpcRendererDispatcher());
contextBridge.exposeInMainWorld("pty", ptyBridge);
