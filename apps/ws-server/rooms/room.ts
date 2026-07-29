import type { WebSocket } from "ws";
import { JOIN_ROOM, LEAVE_ROOM, CHAT, GET_ROOM_INFO, ADD_TO_QUEUE, GET_QUEUE, QUEUE_UPDATED, SONG_ENDED, PLAYBACK_START, PLAYBACK_STOP, CURRENTLY_PLAYING } from "../lib/messages";
import { db } from "@repo/db/db";
import { MusicHandler } from "../music/musicHandler";
import { voting } from "../voting/voting";
import { MemoryStore } from "../memory/memoryStore";
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

          const Store = MemoryStore.getInstance();
          Store.removeUserFromRoom(roomId, socket.userId!);
          Store.broadcastActiveMembers(roomId);

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
    MusicHandler.SearchSong(socket);
    voting.voting(socket);

    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(message);

        if (message.type == JOIN_ROOM) {
          const { code, password } = message.payload || {};

          if (!code)
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "Missing room code",
              })
            );

          const findRoom = await db.room.findUnique({
            where: { code: code },
            include: { createdBy: true },
          });

          if (!findRoom) {
            return socket.send(
              JSON.stringify({ type: "Error", message: "room not found" })
            );
          }

          if (findRoom.isPrivate == true) {
            const isValid = await bcrypt.compare(
              password,
              findRoom.password || ""
            );

            if (!isValid)
              return socket.send(
                JSON.stringify({
                  type: "Error",
                  message: !password ? "Enter password" : "Incorrect password",
                })
              );
          }

          const roomAdded = await db.roomUser.create({
            data: {
              user: { connect: { id: socket.userId } },
              roomId: findRoom.id,
            },
          });

          await db.recentRoom.upsert({
            where: { userId_roomId: { userId: socket.userId!, roomId: findRoom.id } },
            update: { roomName: findRoom.name, roomCode: findRoom.code, hostName: findRoom.createdBy.username, lastJoinedAt: new Date() },
            create: { userId: socket.userId!, roomId: findRoom.id, roomName: findRoom.name, roomCode: findRoom.code, hostName: findRoom.createdBy.username },
          });

          const store = MemoryStore.getInstance();
          store.addUserToRoom(findRoom.id, socket.userId!);
          store.broadcastActiveMembers(findRoom.id);

          socket.send(
            JSON.stringify({
              type: "JOIN_SUCCESS",
              roomId: roomAdded.roomId,
              roomName: findRoom.name,
              roomAdmin: findRoom.createdBy.username,
            })
          );
        }

        if (message.type == GET_ROOM_INFO) {
          const { roomId } = message.payload || {};
          if (!roomId)
            return socket.send(
              JSON.stringify({ type: "Error", message: "roomId is required" })
            );

          const findRoom = await db.room.findUnique({
            where: { id: roomId },
            include: { createdBy: true },
          });

          if (!findRoom)
            return socket.send(
              JSON.stringify({ type: "Error", message: "Room not found" })
            );

          await db.recentRoom.upsert({
            where: { userId_roomId: { userId: socket.userId!, roomId: findRoom.id } },
            update: { roomName: findRoom.name, roomCode: findRoom.code, hostName: findRoom.createdBy.username, lastJoinedAt: new Date() },
            create: { userId: socket.userId!, roomId: findRoom.id, roomName: findRoom.name, roomCode: findRoom.code, hostName: findRoom.createdBy.username },
          });

          const store = MemoryStore.getInstance();
          store.addUserToRoom(findRoom.id, socket.userId!);
          store.broadcastActiveMembers(findRoom.id);

          socket.send(
            JSON.stringify({
              type: "JOIN_SUCCESS",
              roomId: findRoom.id,
              roomName: findRoom.name,
              roomAdmin: findRoom.createdBy.username,
            })
          );
        }

        if (message.type == CHAT) {
          const { message: text, roomId } = message.payload || {};
          if (!text || !roomId || !socket.userId)
            return socket.send(
              JSON.stringify({ type: "Error", message: "Missing message or roomId" })
            );

          const user = await db.user.findUnique({
            where: { id: socket.userId },
          });
          if (!user) return;

          const chatMessage = {
            id: crypto.randomUUID(),
            user: user.username,
            avatar: "👤",
            text: String(text).slice(0, 1000),
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          MemoryStore.getInstance().broadcastToRoom(roomId, {
            type: CHAT,
            message: chatMessage,
          });
        }

        if (message.type == ADD_TO_QUEUE) {
          const { song, roomId } = message.payload || {};
          if (!song || !roomId)
            return socket.send(
              JSON.stringify({ type: "Error", message: "Missing song data" })
            );

          const savedStream = await db.streams.upsert({
            where: { videoId: song.videoId },
            update: {
              songName: song.songName || song.title,
              artistName: song.artist || song.artistName,
              thumbnailUrl: song.thumbnail || song.thumbnailUrl,
              roomId: roomId,
              userId: socket.userId!,
            },
            create: {
              type: "SONG",
              videoId: song.videoId,
              songName: song.songName || song.title,
              artistName: song.artist || song.artistName,
              thumbnailUrl: song.thumbnail || song.thumbnailUrl,
              roomId: roomId,
              userId: socket.userId!,
            },
          });

          const store = MemoryStore.getInstance();
          store.broadcastToRoom(roomId, {
            type: QUEUE_UPDATED,
            stream: savedStream,
          });

          socket.send(
            JSON.stringify({
              type: "Success",
              message: "Song added to queue",
              savedStream,
            })
          );

          // Auto-start playback if nothing is currently playing
          const current = store.getCurrentPlayback(roomId);
          if (!current) {
            const newCurrent = {
              id: savedStream.id,
              videoId: savedStream.videoId,
              title: savedStream.songName,
              artist: savedStream.artistName,
              thumbnail: savedStream.thumbnailUrl,
            };
            store.setCurrentPlayback(roomId, newCurrent);
            store.broadcastToRoom(roomId, {
              type: PLAYBACK_START,
              song: newCurrent,
            });
          }
        }

        if (message.type == SONG_ENDED) {
          const { videoId, roomId } = message.payload || {};
          console.log("[Server] SONG_ENDED received:", { videoId, roomId });
          if (!videoId || !roomId)
            return socket.send(
              JSON.stringify({ type: "Error", message: "videoId and roomId required" })
            );

          try {
            const stream = await db.streams.findUnique({ where: { videoId } });
            if (stream) {
              await db.upvotes.deleteMany({ where: { streamId: stream.id } });
            }
            await db.streams.delete({ where: { videoId } });
            console.log("[Server] Stream deleted:", videoId);

            const store = MemoryStore.getInstance();
            store.setCurrentPlayback(roomId, null);

            const remaining = await db.streams.findMany({
              where: { roomId },
              include: { _count: { select: { upvotes: true } } },
            });
            console.log("[Server] Remaining streams:", remaining.length);

            if (remaining.length > 0) {
              remaining.sort((a, b) => {
                const voteDiff = b._count.upvotes - a._count.upvotes;
                if (voteDiff !== 0) return voteDiff;
                return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
              });

              const next = remaining[0]!;
              const nextSong = {
                id: next.id,
                videoId: next.videoId,
                title: next.songName,
                artist: next.artistName,
                thumbnail: next.thumbnailUrl,
              };
              store.setCurrentPlayback(roomId, nextSong);
              console.log("[Server] Broadcasting PLAYBACK_START:", nextSong);
              store.broadcastToRoom(roomId, {
                type: PLAYBACK_START,
                song: nextSong,
              });
            } else {
              console.log("[Server] Broadcasting PLAYBACK_STOP");
              store.broadcastToRoom(roomId, {
                type: PLAYBACK_STOP,
              });
            }
          } catch (err) {
            console.error("Error handling SONG_ENDED:", err);
          }
        }

        if (message.type == GET_QUEUE) {
          const { roomId } = message.payload || {};
          if (!roomId)
            return socket.send(
              JSON.stringify({ type: "Error", message: "roomId is required" })
            );

          const store = MemoryStore.getInstance();
          let current = store.getCurrentPlayback(roomId);

          if (!current) {
            const allStreams = await db.streams.findMany({
              where: { roomId },
              include: { _count: { select: { upvotes: true } } },
            });

            if (allStreams.length > 0) {
              allStreams.sort((a, b) => {
                const voteDiff = b._count.upvotes - a._count.upvotes;
                if (voteDiff !== 0) return voteDiff;
                return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
              });

              const first = allStreams[0]!;
              current = {
                id: first.id,
                videoId: first.videoId,
                title: first.songName,
                artist: first.artistName,
                thumbnail: first.thumbnailUrl,
              };
              store.setCurrentPlayback(roomId, current);
              console.log("[Server] Auto-restored currentPlayback:", current);
              store.broadcastToRoom(roomId, {
                type: PLAYBACK_START,
                song: current,
              });
            }
          }

          const streams = await db.streams.findMany({
            where: { roomId, ...(current ? { id: { not: current.id } } : {}) },
            include: {
              _count: { select: { upvotes: true } },
              upvotes: { where: { userId: socket.userId } },
            },
          });

          socket.send(
            JSON.stringify({
              type: "QUEUE_DATA",
              queue: streams
                .map((s) => ({
                  id: s.id,
                  videoId: s.videoId,
                  title: s.songName,
                  artist: s.artistName,
                  thumbnail: s.thumbnailUrl,
                  votes: s._count.upvotes,
                  userVoted: s.upvotes.length > 0,
                }))
                .sort((a, b) => b.votes - a.votes),
              currentlyPlaying: current || null,
            })
          );
        }

      } catch (err) {
        console.log(err);
      }
    });
  }
}
