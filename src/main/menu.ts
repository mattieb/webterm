import { Menu } from "electron";

const isMac = process.platform === "darwin";

export const buildApplicationMenu = (createWindow: () => void) =>
  Menu.buildFromTemplate([
    { role: "appMenu" },
    {
      label: "File",
      submenu: isMac
        ? [
            {
              label: "New Terminal",
              accelerator: "Command+N",
              click: createWindow,
            },
            { role: "close" },
          ]
        : [{ role: "quit" }],
    },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ]);
