import { IPty } from "node-pty";
import { isUndefined } from "../common/is-undefined";

const ptys: Record<string, IPty> = {};

export const ptyFor = (webContents: Electron.WebContents): IPty => {
  const pty = ptys[webContents.id];
  if (isUndefined(pty))
    throw new Error(
      `webContents id ${webContents.id} has no stored pty`
    );
  return pty;
};

const reap = (pty: IPty) => {
  console.warn(`pid ${pty.pid}: pty orphaned, killing`);
  pty.kill();
  pty.onExit(() => console.log(`pid ${pty.pid}: pty exited`));
};

export const storePty = (webContents: Electron.WebContents, pty: IPty) => {
  if (webContents.id in ptys) reap(ptys[webContents.id]);
  ptys[webContents.id] = pty;
};
