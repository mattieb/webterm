import { IDispatcher, partial } from "webterm-core";

export interface ITerminalBridge {
  exit: () => void;
  onClose: (listener: () => void) => void;
  onInput: (listener: (input: string) => void) => void;
  onResize: (listener: (columns: number, rows: number) => void) => void;
  output: (output: string) => void;
  ready: () => void;
}

export const buildTerminalBridge = (
  dispatcher: IDispatcher
): ITerminalBridge => ({
  exit: partial(dispatcher.send, "exit"),
  onClose: partial(dispatcher.on, "close"),
  onInput: partial(dispatcher.on, "input"),
  onResize: partial(dispatcher.on, "resize"),
  output: partial(dispatcher.send, "output"),
  ready: partial(dispatcher.send, "ready"),
});
