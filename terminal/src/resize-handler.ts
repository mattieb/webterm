import { FitAddon } from "@xterm/addon-fit";
import { isUndefined } from "webterm-core";
import { IPtyBridge } from "./pty-bridge.js";

export const buildResizeHandler =
  (fitAddon: FitAddon, ptyResizeListener: IPtyBridge["resize"]) => () => {
    const dimensions = fitAddon.proposeDimensions();
    if (isUndefined(dimensions))
      throw new Error("fit addon proposed undefined dimensions");
    fitAddon.fit();
    ptyResizeListener(dimensions.cols, dimensions.rows);
  };
