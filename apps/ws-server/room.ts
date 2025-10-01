import WebSocket, { WebSocketServer } from "ws";

interface Room_Admin {
  roomId: string;
  adminId: string;
}

export class Room {
  private roomId: [];
  private adminId: [];
  constructor() {
    this.roomId = [];
    this.adminId = [];
  }

  addUser(socket: WebSocket) {}
  removeUser(socket: WebSocket) {}
}
