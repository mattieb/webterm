import {
  spawn,
  type IPtyForkOptions,
  type IWindowsPtyForkOptions,
} from "node-pty";
import { ITerminalBridge } from "./terminal-bridge.js";

export const newSession = (
  terminal: ITerminalBridge,
  spawnFile: string,
  spawnArgs: string[],
  spawnOptions: IPtyForkOptions | IWindowsPtyForkOptions,
  logInfo: (message: string, ...parameters: any[]) => void
) => {
  const pty = spawn(spawnFile, spawnArgs, spawnOptions);
  pty.onData(terminal.output);
  const onExit = pty.onExit(() => {
    logInfo("pid %d: exited", pty.pid);
    terminal.exit();
    onExit.dispose();
  });
  // terminal.onInput((input) => pty.write(input));
  terminal.onInput(pty.write.bi(pty));
  terminal.onResize(pty.resize.bind(pty));
  terminal.onClose(() => {
    logInfo("pid %d: killing due to window close");
    pty.kill();
  });
  terminal.ready();
};
