import { IDispatcher, partial } from "webterm-core";

export interface IPtyBridge {
  close: () => void;
  input: (input: string) => void;
  onExit: (listener: () => void) => void;
  onOutput: (listener: (output: string) => void) => void;
  onReady: (listener: () => void) => void;
  resize: (columns: number, rows: number) => void;
}

export const buildPtyBridge = (dispatcher: IDispatcher): IPtyBridge => ({
  close: partial(dispatcher.send, "close"),
  input: partial(dispatcher.send, "input"),
  onExit: partial(dispatcher.on, "exit"),
  onOutput: partial(dispatcher.on, "output"),
  onReady: partial(dispatcher.on, "ready"),
  resize: partial(dispatcher.send, "resize"),
});
