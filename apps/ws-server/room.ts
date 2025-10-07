import WebSocket, { WebSocketServer } from "ws";
import { JOIN_ROOM } from "./lib/messages";
import { db } from "@repo/db/db";

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

  joinRoom(socket: WebSocket) {
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {}

  private addHandler(socket: WebSocket) {
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      if (message.type == JOIN_ROOM) {
        const { code, password } = message.payload || {};
        if (!code && !password)
          return socket.send(
            JSON.stringify({
              type: "Error",
              message: "Missing roomcode and password",
            })
          );

        const findRoom = await db.room.findUnique({
          where: { code: code },
        });

        if (!findRoom)
          return socket.send(
            JSON.stringify({ type: "Error", message: "room not found" })
          );

        if (findRoom.isPrivate == true) {
          if (!password || findRoom.password !== password)
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: !password ? "Enter password" : "Incorrect password",
              })
            );

          const joinRoom = await db.roomUser.create({
            data: {
              user: {
                connect: {
                  id: (socket as any).userId,
                },
              },
              roomId: findRoom.id,
            },
          });

          socket.send(
            JSON.stringify({
              type: "JOIN_SUCCESS",
            })
          );
        }
      }
    });
  }
}
