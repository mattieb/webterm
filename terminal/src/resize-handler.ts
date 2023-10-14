import { FitAddon } from "xterm-addon-fit";
import { IPtyBridge } from "./pty-bridge.js";
import { isUndefined } from "webterm-core";

export const buildResizeHandler =
  (fitAddon: FitAddon, ptyResizeListener: IPtyBridge["resize"]) => () => {
    const dimensions = fitAddon.proposeDimensions();
    if (isUndefined(dimensions))
      throw new Error("fit addon proposed undefined dimensions");
    fitAddon.fit();
    ptyResizeListener(dimensions.cols, dimensions.rows);
  };
