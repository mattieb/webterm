import "./index.css";
import type { MainApi } from "./preload";
import { initializeTerminal } from "./renderer/initialize-terminal";
import "xterm/css/xterm.css";

declare global {
  interface Window {
    main: MainApi;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTerminal(document.getElementById("terminal"));
});
