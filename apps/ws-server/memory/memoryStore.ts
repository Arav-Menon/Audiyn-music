import WebSocket from "ws";
import { ACTIVE_MEMBERS } from "../lib/messages";

export interface PlaybackSong {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export class MemoryStore {
  private static instance: MemoryStore;
  private activeUsers = new Map<string, Set<WebSocket>>();
  private roomMembers = new Map<string, Set<string>>();
  private currentPlayback = new Map<string, PlaybackSong | null>();

  static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  addUser(userId: string, socket: WebSocket) {
    if (!this.activeUsers.has(userId)) {
      this.activeUsers.set(userId, new Set());
    }
    this.activeUsers.get(userId)!.add(socket);
  }
  removeUser(userId: string, socket: WebSocket) {
    const sockets = this.activeUsers.get(userId);
    if (sockets) {
      sockets.delete(socket);
      if (sockets.size > 0) return;
    }
    this.activeUsers.delete(userId);
    for (const [roomId, users] of this.roomMembers.entries()) {
      users.delete(userId);
      if (users.size == 0) {
        this.roomMembers.delete(roomId);
      }
    }
  }
  getUserSocket(userId: string) {
    const sockets = this.activeUsers.get(userId);
    return sockets?.values().next().value || null;
  }
  addUserToRoom(roomId: string, userId: string) {
    if (!this.roomMembers.has(roomId)) this.roomMembers.set(roomId, new Set());
    this.roomMembers.get(roomId)?.add(userId);
  }
  removeUserFromRoom(roomId: string, userId: string) {
    if (this.roomMembers.has(roomId)) {
      this.roomMembers.get(roomId)?.delete(userId);

      if (this.roomMembers.get(roomId)?.size == 0) {
        this.roomMembers.delete(roomId);
      }
    }
  }
  getRoomMembers(roomId: string) {
    return this.roomMembers.get(roomId) || new Set();
  }

  getUserRooms(userId: string): string[] {
    const rooms: string[] = [];
    for (const [roomId, users] of this.roomMembers.entries()) {
      if (users.has(userId)) {
        rooms.push(roomId);
      }
    }
    return rooms;
  }

  broadcastActiveMembers(roomId: string) {
    const members = this.roomMembers.get(roomId);
    this.broadcastToRoom(roomId, {
      type: ACTIVE_MEMBERS,
      count: members?.size || 0,
    });
  }

  setCurrentPlayback(roomId: string, song: PlaybackSong | null) {
    if (song === null) {
      this.currentPlayback.delete(roomId);
    } else {
      this.currentPlayback.set(roomId, song);
    }
  }
  getCurrentPlayback(roomId: string): PlaybackSong | null {
    return this.currentPlayback.get(roomId) || null;
  }

  broadcastToRoom(roomId: string, message: any) {
    const members = this.roomMembers.get(roomId);
    if (!members) return;

    for (const userId of members) {
      const sockets = this.activeUsers.get(userId);
      if (!sockets) continue;

      for (const client of sockets) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      }
    }
  }
}
