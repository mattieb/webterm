import type { TerminalDimensions } from "../common/types";
import type { MainApi } from "../preload";
import { FitAddon } from "xterm-addon-fit";

export const buildResizeHandler =
  (fitAddon: FitAddon, terminalResizeHandler: MainApi["resize"]) => () => {
    const dimensions: TerminalDimensions = fitAddon.proposeDimensions();
    fitAddon.fit();
    terminalResizeHandler(dimensions);
  };
