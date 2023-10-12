export interface IDispatcher {
  on(channel: string, listener: (...args: any[]) => void): void;
  send(channel: string, ...args: any[]): void;
}

// const ipcRendererDispatcher = (ipc: IpcRenderer): IDispatcher => ({
//     on: (channel: string, listener: Listener) =>
//         ipc.on(channel, (_: any, ...args: any[]) => listener(...args)),
//     send: ipc.send
// });

// const isArray = (value: any): value is any[] => Array.isArray(value);

// const websocketDispatcher = (ws: WebSocket): IDispatcher => {
//     const listenerMap: Map<string, readonly Listener[]> = new Map();

//     const on = (channel: string, listener: Listener) => {
//         const listeners = listenerMap.get(channel) ?? [];
//         listenerMap.set(channel, listeners.concat([listener]));
//     }

//     const send = (channel: string, ...args: any[]) => ws.send(JSON.stringify([channel, ...args]))

//     ws.addEventListener('message', (event) => {
//         const message = JSON.parse(event.data);
//         if (!isArray(message)) throw new TypeError("message is not array");
//         const channel = message[0];
//         if (typeof channel !== 'string') throw new TypeError("channel is not string");
//         const listeners = listenerMap.get(channel);
//         if (typeof listeners === 'undefined') return;
//         for (const listener of listeners) {
//             try {
//                 listener(message.slice(1));
//             } catch(error) {
//                 console.error(error);
//             }
//         }
//     });

//     return { on, send };
// }
