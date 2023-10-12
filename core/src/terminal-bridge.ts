import { IDispatcher } from "./dispatcher.js";
import { partial } from "./partial.js";

export interface ITerminalBridge {
  output: (output: string) => void;
  exit: () => void;
  ready: () => void;
  onInput: (listener: (input: string) => void) => void;
  onResize: (listener: (columns: number, rows: number) => void) => void;
  onClose: (listener: () => void) => void;
}

export const buildTerminalBridge = (
  dispatcher: IDispatcher
): ITerminalBridge => ({
  output: partial(dispatcher.send, "output"),
  exit: partial(dispatcher.send, "exit"),
  ready: partial(dispatcher.send, "ready"),
  onInput: partial(dispatcher.on, "input"),
  onResize: partial(dispatcher.on, "resize"),
  onClose: partial(dispatcher.on, "close"),
});
