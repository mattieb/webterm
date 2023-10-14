import { disable, enable } from "./html-disable";
import { buildResizeHandler } from "./resize-handler";
import { ITerminalOptions, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const terminalOptions: ITerminalOptions = {
  fontFamily: "SF Mono",
  fontSize: 13,
  minimumContrastRatio: 7, // WCAG AAA
};

export const initializeTerminal = (terminalElement: HTMLElement) => {
  const terminal = new Terminal(terminalOptions);
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(terminalElement);

  terminal.onData(window.pty.input);

  window.pty.onOutput((output) => {
    enable(terminalElement);
    terminal.write(output);
  });

  const resize = buildResizeHandler(fitAddon, window.pty.resize);
  window.addEventListener("resize", resize);

  terminal.onTitleChange((title) => (document.title = title));

  window.pty.onExit(() => disable(terminalElement));

  window.pty.onReady(() => {
    resize();
    terminal.focus();
  });
};
