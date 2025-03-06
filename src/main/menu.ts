import { Menu } from "electron";

const isMac = process.platform === "darwin";

export const buildApplicationMenu = (createWindow: () => void) =>
  isMac
    ? Menu.buildFromTemplate([
        { role: "appMenu" },
        {
          label: "File",
          submenu: [
            {
              label: "New Terminal",
              accelerator: "Command+N",
              click: createWindow,
            },
            { role: "close" },
          ],
        },
        { role: "editMenu" },
        { role: "viewMenu" },
        { role: "windowMenu" },
      ])
    : Menu.buildFromTemplate([
        {
          label: "File",
          submenu: [
            {
              label: "New Terminal",
              accelerator: "Ctrl+N",
              click: createWindow,
            },
            { role: "close" },
            { role: "quit" },
          ],
        },
        { role: "editMenu" },
        { role: "viewMenu" },
        { role: "windowMenu" },
      ]);
