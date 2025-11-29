import type { WebSocket } from "ws";
import { JOIN_ROOM, LEAVE_ROOM } from "../lib/messages";
import { db } from "@repo/db/db";
import { MusicHandler } from "../music/musicHandler";
import { voting } from "../voting/voting";
import bcrypt from "bcrypt";

export class Room {
  joinRoom(socket: WebSocket) {
    console.log("user pass Authentication", socket.userId);
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {
    this.removeHandler(socket);
  }

  leaveRoom(socket: WebSocket) {
    this.leaveHandler(socket);
  }

  private async removeHandler(socket: WebSocket) {
    try {
      if (!socket.userId) return;

      const findUser = await db.user.findUnique({
        where: { id: socket.userId },
      });

      if (!findUser)
        return socket.send(
          JSON.stringify({
            message: `user with this ${socket.userId} does not found`,
          })
        );

      // Delete all room associations for this user
      const deletedRooms = await db.roomUser.deleteMany({
        where: { userId: socket.userId },
      });

      console.log(
        `User ${socket.userId} disconnected and removed from ${deletedRooms.count} room(s)`
      );

      // Optional: Notify other users in the room via broadcast
      // this.broadcastToRoom(roomId, { type: 'user_left', userId: socket.userId });

      socket.send(
        JSON.stringify({
          message: `user with ${socket.userId} removed`,
          deletedRooms,
        })
      );
    } catch (err) {
      console.error(`Error removing user ${socket.userId}:`, err);
      socket.send(
        JSON.stringify({
          message: err,
        })
      );
    }
  }

  private async leaveHandler(socket: WebSocket) {
    try {
      if (!socket.userId) return;

      socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());

        if (message.type == LEAVE_ROOM) {
          const { roomId } = message.payload || {};

          // Validate roomId is provided
          if (!roomId) {
            return socket.send(
              JSON.stringify({
                message: "roomId is required",
              })
            );
          }

          const findUser = await db.user.findUnique({
            where: { id: socket.userId },
          });

          // Fixed: Should query room table, not user table
          const findRoom = await db.room.findUnique({
            where: { id: roomId },
          });

          if (!findUser) {
            return socket.send(
              JSON.stringify({
                message: `User with id ${socket.userId} does not exist`,
              })
            );
          }

          if (!findRoom) {
            return socket.send(
              JSON.stringify({
                message: `Room with id ${roomId} does not exist`,
              })
            );
          }

          // Delete the specific room-user association, not all associations
          const deleteRoomUser = await db.roomUser.deleteMany({
            where: {
              userId: socket.userId,
              roomId: roomId,
            },
          });

          if (deleteRoomUser.count === 0) {
            return socket.send(
              JSON.stringify({
                message: `User is not in room ${roomId}`,
              })
            );
          }

          console.log(`User ${socket.userId} left room ${roomId}`);

          socket.send(
            JSON.stringify({
              message: "USER_LEAVE",
              userId: socket.userId,
              roomId: roomId,
            })
          );
        }
      });
    } catch (err) {
      console.error(`Error removing user ${socket.userId}:`, err);
      socket.send(
        JSON.stringify({
          message: "An error occurred while leaving the room",
          error: err instanceof Error ? err.message : "Unknown error",
        })
      );
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
            const isValid = await bcrypt.compare(
              password,
              message.payload.password
            );

            if (!isValid)
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
                roomId: roomAdded.roomId,
                roomName: findRoom.name,
                roomAdmin: findRoom.adminId,
              })
            );
          }

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

          socket.send(
            JSON.stringify({
              type: "JOIN_SUCCESS",
              roomId: roomAdded.roomId,
              roomName: findRoom.name,
              roomAdmin: findRoom.adminId,
            })
          );
        }

        MusicHandler.SearchSong(socket);
        voting.voting(socket);
      } catch (err) {
        socket.close(4002);
        console.log(err);
      }
    });
  }
}
