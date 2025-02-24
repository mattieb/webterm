import { app, BrowserWindow, Menu } from "electron";
import { buildApplicationMenu } from "./menu.js";
import { newWindow } from "./new-window.js";

process.on("uncaughtException", console.error);

app.on("ready", () => {
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
