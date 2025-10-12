type UserData = {
  userId: string;
  socket?: WebSocket;
};

export class MemoryRoomStore {
  private rooms: Record<string, UserData[]> = {};

  addUser(code: string, user: UserData) {
    if (!this.rooms[code]) this.rooms[code] = [];

    if (!this.rooms[code].some((u) => u.userId === user.userId)) {
      this.rooms[code].push(user);
    }
  }

  removeUser(code: string, userId: string) {
    if (!this.rooms[code]) return;
    this.rooms[code] = this.rooms[code].filter((u) => u.userId !== userId);
  }

  getUserCount(code: string) {
    return this.rooms[code]?.length || 0;
  }
}

export const memoryRoomStore = new MemoryRoomStore();
