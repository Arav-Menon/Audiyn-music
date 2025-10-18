import WebSocket from "ws";

interface AddToRoom {
  socket: WebSocket;
  room: string;
}

export class MemoryStore {
  private activeUsers = new Map<string, WebSocket>();
  private roomMembers = new Map<string, Set<string>>();

  addUser(userId: string, socket: WebSocket) {
    this.activeUsers.set(userId, socket);
  }
  removeUser(userId: string) {
    this.activeUsers.delete(userId);
    for (const [roomId, users] of this.roomMembers.entries()) {
      users.delete(userId);
      if (users.size == 0) this.roomMembers.delete(roomId);
    }
  }
  getUserSocket(userId: string) {
    return this.activeUsers.get(userId);
  }
  addUserToRoom(roomId: string, userId: string) {
    if (!this.roomMembers.has(roomId)) this.roomMembers.set(roomId, new Set());
    this.roomMembers.get(roomId)?.add(userId);
  }
  removeUserFromRoom(roomId: string, userId: string) {
    if (this.roomMembers.has(roomId)) {
      this.roomMembers.get(roomId)?.delete(userId);

      if (this.roomMembers.get(roomId)?.size == 0)
        this.roomMembers.delete(roomId);
    }
  }
  getRoomMembers(roomId: string) {
    return this.roomMembers.get(roomId) || new Set();
  }
  broadcastToRoom(roomId: string, message: any) {
    const members = this.roomMembers.get(roomId);
    if (!members) return;

    for (const userId of members) {
      const client = this.activeUsers.get(userId);

      if (client?.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }
}
