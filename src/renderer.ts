import "xterm/css/xterm.css";
import "./index.css";
import { Terminal } from "xterm";
import type { MainApi } from "./preload";
import { FitAddon } from "xterm-addon-fit";
import { TerminalDimensions } from "./common/types";

const terminalOptions = {
  fontFamily: "SF Mono",
};

declare global {
  interface Window {
    main: MainApi;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const terminalElement = document.getElementById("terminal");

  const terminal = new Terminal(terminalOptions);

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  terminal.open(terminalElement);

  const resize = () => {
    const dimensions: TerminalDimensions = fitAddon.proposeDimensions();
    fitAddon.fit();
    window.main.resize(dimensions);
  };
  window.addEventListener("resize", resize);

  terminal.onData((data) => window.main.data(data));
  terminal.onTitleChange((title) => (document.title = title));

  window.main.onData((data) => {
    terminalElement.removeAttribute("disabled");
    terminal.write(data);
  });

  window.main.onExit(() => terminalElement.setAttribute("disabled", "true"));

  window.main.onReady(() => {
    resize();
    terminal.focus();
  });
});
