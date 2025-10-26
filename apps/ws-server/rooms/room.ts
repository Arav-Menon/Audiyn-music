import type { WebSocket } from "ws";
import { JOIN_ROOM } from "../lib/messages";
import { db } from "@repo/db/db";
import { MusicHandler } from "../music/musicHandler";

export class Room {
  joinRoom(socket: WebSocket) {
    console.log("user pass Authentication", socket.userId);
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {
    this.removeHandler(socket);
  }

  private async removeHandler(socket: WebSocket) {
    socket.on("close", async () => {
      const findUser = await db.user.findUnique({
        //@ts-ignore
        where: { userId: socket.userId },
      });

      if (!findUser)
        return socket.send(JSON.stringify({ message: "user not exist" }));

      const leaveRoom = await db.roomUser.delete({
        where: { id: findUser.id },
      });

      console.log(`user leave the room ${leaveRoom.roomId}`);
      socket.send(
        JSON.stringify({
          message: `user leave the room ${leaveRoom.roomId}`,
          room: leaveRoom,
        })
      );
    });
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(message);
        if (message.type == JOIN_ROOM) {
          const { code, password } = message.payload || {};

          const codes = { code, password };
          console.log(codes);

          if (!code)
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "Missing roomcode and password",
              })
            );

          const findRoom = await db.room.findUnique({
            where: { code: code },
          });

          console.log(findRoom);

          if (!findRoom) return console.log("not found the room");
          socket.send(
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

            const roomAdded = await db.roomUser.create({
              data: {
                user: {
                  connect: {
                    id: socket.userId,
                  },
                },
                roomId: findRoom.id,
              },
            });

            console.log(roomAdded);
            socket.send(
              JSON.stringify({
                type: "JOIN_SUCCESS",
              })
            );
          }

          await db.roomUser.create({
            data: {
              user: {
                connect: {
                  id: socket.userId,
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

      MusicHandler.SearchSong(socket);
      } catch (err) {
        socket.close(4002);
        console.log(err);
      }
    });
  }
}
