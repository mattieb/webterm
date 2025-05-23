import { FitAddon } from "@xterm/addon-fit";
import { ITerminalOptions, Terminal } from "@xterm/xterm";
import { disable, enable } from "./html-disable.js";
import { IPtyBridge } from "../preload/pty-bridge.js";
import { buildResizeHandler } from "./resize-handler.js";
import { Unicode11Addon } from "@xterm/addon-unicode11";

const terminalOptions: ITerminalOptions = {
  allowProposedApi: true,
  fontFamily: '"SF Mono", "Cascadia Mono", ui-monospace, monospace',
  fontSize: 13,
  minimumContrastRatio: 7, // WCAG AAA
};

export const initializeTerminal = async (
  terminalElement: HTMLElement,
  pty: IPtyBridge
) => {
  const terminal = new Terminal(terminalOptions);

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  
  const unicode11Addon = new Unicode11Addon();
  terminal.loadAddon(unicode11Addon);
  terminal.unicode.activeVersion = "11";

  terminal.open(terminalElement);

  terminal.onData((input) => pty.input(input));

  pty.onOutput((output) => {
    enable(terminalElement);
    terminal.write(output);
    false;
  });

  const resize = buildResizeHandler(fitAddon, pty.resize);
  window.addEventListener("resize", resize);

  terminal.onTitleChange((title) => (document.title = title));

  pty.onClose(() => disable(terminalElement));

  pty.onReady(() => {
    resize();
    terminal.focus();
  });
};
