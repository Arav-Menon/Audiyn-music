import WebSocket from "ws";
import { JOIN_ROOM, LEAVE_ROOM } from "../lib/messages";
import { db } from "@repo/db/db";
import { FileWatcherEventKind, WatchDirectoryFlags } from "typescript";

export class Room {
  joinRoom(socket: WebSocket) {
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {
    console.log("user leave the room");
    this.removeHandler(socket);
  }

  private async removeHandler(socket: WebSocket) {
    try {
      const findUser = await db.user.findMany({
        where: { id: "13233d5f-254a-4a4f-b52f-b4498bebab82" },
      });

      if (!findUser)
        return socket.send(JSON.stringify({ message: "user not exist" }));

      const leaveRoom = await db.roomUser.delete({
        where: { id: "13233d5f-254a-4a4f-b52f-b4498bebab82" },
      });

      console.log(`user leave the room ${leaveRoom.roomId}`);
      socket.send(
        JSON.stringify({
          message: `user leave the room ${leaveRoom.roomId}`,
          room: leaveRoom,
        })
      );
    } catch (err) {
      socket.close(4002, "unauthorized");
    }
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
                    id: "13233d5f-254a-4a4f-b52f-b4498bebab82",
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
                  id: "13233d5f-254a-4a4f-b52f-b4498bebab82",
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
      } catch (err) {
        socket.close(4002);
        console.log(err);
      }
    });
  }
}
