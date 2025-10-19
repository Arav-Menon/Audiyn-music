import "ws";

declare module "ws" {
  interface WebSocket {
    userId?: string;
  }
}
