import "@xterm/xterm/css/xterm.css";
import { initializeTerminal, type IPtyBridge } from "webterm-terminal";
import "./index.css";

declare global {
  interface Window {
    pty: IPtyBridge;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTerminal(document.getElementById("terminal"), window.pty);
});
