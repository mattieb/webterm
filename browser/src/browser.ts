import "./index.css";
import "./index.css";
import "xterm/css/xterm.css";
import { buildWebSocketDispatcher } from "./websocket-dispatcher.js";
import { buildPtyBridge, initializeTerminal } from "webterm-terminal";
import { isNull } from "webterm-core";

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
