import "./index.css";
import { initializeTerminal } from "./renderer/initialize-terminal";
import type { IPtyBridge } from "webterm-core";
import "xterm/css/xterm.css";

declare global {
  interface Window {
    pty: IPtyBridge;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTerminal(document.getElementById("terminal"));
});
