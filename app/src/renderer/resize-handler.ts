import type { TerminalDimensions } from "../common/types";
import { IPtyBridge } from "webterm-core";
import { FitAddon } from "xterm-addon-fit";

export const buildResizeHandler =
  (fitAddon: FitAddon, terminalResizeHandler: IPtyBridge["resize"]) => () => {
    const dimensions: TerminalDimensions = fitAddon.proposeDimensions();
    fitAddon.fit();
    terminalResizeHandler(dimensions.cols, dimensions.rows);
  };
