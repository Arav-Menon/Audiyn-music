import WebSocket from "ws";
import { DOWNVOTE, UPVOTE, VOTE_UPDATE } from "../lib";
import { db } from "@repo/db/db";
import { MemoryStore } from "../memory/memoryStore";

export class Voting {
  public voting(socket: WebSocket) {
    this.votingHandler(socket);
  }

  private async broadcastVoteUpdate(roomId: string, videoId: string) {
    try {
      const stream = await db.streams.findUnique({
        where: { videoId },
        include: { _count: { select: { upvotes: true } } },
      });

      if (stream) {
        MemoryStore.getInstance().broadcastToRoom(roomId, {
          type: VOTE_UPDATE,
          videoId,
          votes: stream._count.upvotes,
        });
      }
    } catch (err) {
      console.error("Error broadcasting vote update:", err);
    }
  }

  private votingHandler(socket: WebSocket) {
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());

      if (message.type == UPVOTE) {
        const { videoId, roomId } = message.payload || {};

        if (!videoId || !roomId) {
          return socket.send(
            JSON.stringify({
              type: "error",
              message: "missing videoId or roomId",
            })
          );
        }

        try {
          const stream = await db.streams.findUnique({
            where: { videoId: videoId },
          });

          if (!stream) {
            return socket.send(
              JSON.stringify({
                type: "error",
                message: "Stream not found",
              })
            );
          }

          await db.upvotes.upsert({
            where: {
              userId_videoId: {
                userId: socket.userId!,
                videoId: videoId,
              },
            },
            update: {},
            create: {
              userId: socket.userId!,
              videoId: videoId,
              streamId: stream.id,
            },
          });

          await this.broadcastVoteUpdate(roomId, videoId);
        } catch (err) {
          console.log(err);
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Failed to upvote",
              error: err,
            })
          );
        }
      }

      if (message.type == DOWNVOTE) {
        const { roomId, videoId } = message.payload || {};

        if (!videoId || !roomId) {
          return socket.send(
            JSON.stringify({
              type: "error",
              message: "missing videoId or roomId",
            })
          );
        }

        try {
          await db.upvotes.delete({
            where: {
              userId_videoId: {
                userId: socket.userId!,
                videoId: videoId,
              },
            },
          });

          await this.broadcastVoteUpdate(roomId, videoId);
        } catch (err) {
          console.log(err);
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Failed to downvote",
              error: err,
            })
          );
        }
      }
    });
  }
}

export const voting = new Voting();
