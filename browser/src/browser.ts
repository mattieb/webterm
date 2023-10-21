import { isNull } from "webterm-core";
import { buildPtyBridge, initializeTerminal } from "webterm-terminal";
import "xterm/css/xterm.css";
import "./index.css";
import { buildWebSocketDispatcher } from "./websocket-dispatcher.js";

document.addEventListener("DOMContentLoaded", () => {
  const webSocket = new WebSocket(`wss://${location.host}/pty`);
  webSocket.addEventListener("open", () => {
    const pty = buildPtyBridge(buildWebSocketDispatcher(webSocket));
    const terminalElement = document.getElementById("terminal");
    if (isNull(terminalElement))
      throw new Error("could not locate terminal element");
    initializeTerminal(terminalElement, pty);
  });
});
