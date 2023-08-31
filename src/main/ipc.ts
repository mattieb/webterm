import { ipcMain } from "electron";
import { ptyFor } from "./ptys";
import type { TerminalDimensions } from "../common/types";

export const setupIpc = () => {
  ipcMain.on("resize", (event, { cols, rows }: TerminalDimensions) => {
    ptyFor(event.sender).resize(cols, rows);
  });

  ipcMain.on("data", (event, data: string) => {
    ptyFor(event.sender).write(data);
  });
};
