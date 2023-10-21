import { IDispatcher } from "webterm-core";

type Listener = (...args: any[]) => void;

interface IWebSocketMessageEvent {
  data: string | Buffer | ArrayBuffer | Buffer[];
}

interface IWebSocket {
  addEventListener(
    channel: "message",
    listener: (event: IWebSocketMessageEvent) => void,
  ): void;
  addEventListener(channel: "close", listener: () => void): void;
  send(data: string): void;
}

export const buildWebSocketDispatcher = (
  webSocket: IWebSocket,
): IDispatcher => {
  const listenerMap: Map<string, readonly Listener[]> = new Map();

  const on = (channel: string, listener: Listener) => {
    const listeners = listenerMap.get(channel) ?? [];
    listenerMap.set(channel, listeners.concat([listener]));
  };

  const send = (channel: string, ...args: any[]) => {
    const message = JSON.stringify([channel, ...args]);
    webSocket.send(message);
  };

  const broadcast = (channel: string, ...args: any[]) => {
    const listeners = listenerMap.get(channel) ?? [];
    for (const listener of listeners) {
      try {
        listener(...args);
      } catch (error) {
        console.error(error);
      }
    }
  };

  webSocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data.toString());
    if (!Array.isArray(message)) throw new TypeError("message is not array");
    const channel = message[0];
    if (typeof channel !== "string")
      throw new TypeError("channel is not string");
    broadcast(channel, ...message.slice(1));
  });

  webSocket.addEventListener("close", () => {
    broadcast("close");
  });

  return { on, send };
};
