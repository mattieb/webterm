// current version of Electron has a require function exposing modules, but import is broken
const { contextBridge, ipcRenderer } = require("electron");

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

console.log("preload exposing");

contextBridge.exposeInMainWorld("pty", ptyBridge);
