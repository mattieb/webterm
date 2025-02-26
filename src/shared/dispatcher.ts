export interface IDispatcher {
  on(channel: string, listener: (...args: any[]) => void): void;
  send(channel: string, ...args: any[]): void;
}
