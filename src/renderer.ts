import { IPtyBridge } from "./pty-bridge.js";
import { initializeTerminal } from "./initialize-terminal.js";
import { isNull } from "./is-null.js";

declare global {
  interface Window {
    pty: IPtyBridge;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const terminalElement = document.getElementById("terminal");
  if (isNull(terminalElement))
    throw new Error("could not find terminal element");
  initializeTerminal(terminalElement, window.pty);
});
