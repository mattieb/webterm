import { type IPtyForkOptions, type IWindowsPtyForkOptions } from "node-pty";
import { ITerminalBridge } from "./terminal-bridge.js";

export const newSession = async (
  terminal: ITerminalBridge,
  spawnFile: string,
  spawnArgs: string[],
  spawnOptions: IPtyForkOptions | IWindowsPtyForkOptions,
  logInfo: (message: string, ...parameters: any[]) => void
) => {
  const nodePty = await import("node-pty");
  const pty = nodePty.spawn(spawnFile, spawnArgs, spawnOptions);
  pty.onData(terminal.output);
  const onExit = pty.onExit(() => {
    logInfo("pid %d: exited", pty.pid);
    terminal.exit();
    onExit.dispose();
  });
  terminal.onInput(pty.write.bind(pty));
  terminal.onResize(pty.resize.bind(pty));
  terminal.onClose(() => {
    logInfo("pid %d: killing due to window close");
    pty.kill();
  });
  terminal.ready();
};
