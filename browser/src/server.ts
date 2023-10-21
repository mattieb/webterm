import express from "express";
import expressWs from "express-ws";
import { spawn } from "node-pty";
import fs from "node:fs";
import https from "node:https";
import { buildTerminalBridge } from "webterm-pty";
import { buildWebSocketDispatcher } from "./websocket-dispatcher.js";

const app = express();

app.use(express.static("dist"));

const key = fs.readFileSync("key.pem");
const cert = fs.readFileSync("cert.pem");

const server = https.createServer(
  {
    key,
    cert,
  },
  app,
);

const wsApp = expressWs(app, server).app;

wsApp.ws("/pty", (ws) => {
  const terminal = buildTerminalBridge(buildWebSocketDispatcher(ws));
  const pty = spawn("/usr/bin/login", [], {
    name: "xterm-256color",
  });

  pty.onData(terminal.output);
  const onExit = pty.onExit(() => {
    console.info("pid %d: exited", pty.pid);
    terminal.close();
    onExit.dispose();
  });
  terminal.onInput(pty.write.bind(pty));
  terminal.onResize(pty.resize.bind(pty));
  terminal.onClose(() => {
    console.info("pid %d: killing due to window close", pty.pid);
    pty.kill();
  });
  terminal.ready();
});

server.listen(4443, () => {
  console.log("server ready");
});
