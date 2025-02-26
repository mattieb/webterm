import type { IDispatcher } from "../shared/dispatcher.js";
import { partial } from "../shared/partial.js";

export interface IPtyBridge {
  close: () => void;
  input: (input: string) => void;
  onClose: (listener: () => void) => void;
  onOutput: (listener: (output: string) => void) => void;
  onReady: (listener: () => void) => void;
  resize: (columns: number, rows: number) => void;
}

export const buildPtyBridge = (dispatcher: IDispatcher): IPtyBridge => ({
  close: partial(dispatcher.send, "close"),
  input: partial(dispatcher.send, "input"),
  onClose: partial(dispatcher.on, "close"),
  onOutput: partial(dispatcher.on, "output"),
  onReady: partial(dispatcher.on, "ready"),
  resize: partial(dispatcher.send, "resize"),
});
