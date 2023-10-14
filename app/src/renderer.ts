import "./index.css";
import { initializeTerminal, type IPtyBridge } from "webterm-terminal";
import "xterm/css/xterm.css";

declare global {
  interface Window {
    pty: IPtyBridge;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTerminal(document.getElementById("terminal"), window.pty);
});
