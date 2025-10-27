import WebSocket from "ws";
import { DOWNVOTE, UPVOTE } from "../lib";
import { db } from "@repo/db/db";

export class Voting {
  public voting(socket: WebSocket) {
    this.votingHandler(socket);
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

          const upvote = await db.upvotes.upsert({
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
              streamId: stream.id
            },
          });

          socket.send(
            JSON.stringify({
              type: "success",
              message: "successfully upvoted",
              upvote,
            })
          );
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
          const downVote = await db.upvotes.delete({
            where: {
              userId_videoId: {
                userId: socket.userId!,
                videoId: videoId,
              },
            },
          });

          socket.send(
            JSON.stringify({
              type: "success",
              message: "successfully downvoted",
              downVote,
            })
          );
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
    });
  }
}

export const voting = new Voting();
