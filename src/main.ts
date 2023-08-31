import { app, BrowserWindow, Menu } from "electron";
import { buildApplicationMenu } from "./main/menu";
import { newWindow } from "./main/new-window";
import { setupIpc } from "./main/ipc";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require("electron-squirrel-startup")) {
//   app.quit();
// }

app.on("ready", () => {
  setupIpc();
  Menu.setApplicationMenu(buildApplicationMenu(newWindow));
  newWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    newWindow();
  }
});
