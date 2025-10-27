import type { WebSocket } from "ws";
import YTMusic from "ytmusic-api";
import { SEARCH_SONG } from "../lib";
import { db } from "@repo/db/db";

export class MusicHandler {
  private static ytmusic: YTMusic;
  private static isInitialized = false;

  static async initialize() {
    if (!this.isInitialized) {
      try {
        this.ytmusic = new YTMusic();
        await this.ytmusic.initialize(); // THIS IS THE CRITICAL LINE YOU'RE MISSING
        this.isInitialized = true;
        console.log("YTMusic initialized successfully");
      } catch (error) {
        console.error("Failed to initialize YTMusic:", error);
        throw error;
      }
    }
  }

  static async SearchSong(socket: WebSocket) {
    console.log("Request is coming here");
    if (!this.isInitialized) {
      await this.initialize();
    }

    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === SEARCH_SONG) {
          const { songName, roomId } = message.payload || {};

          if (!songName || !roomId) {
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "Payload is missing",
              })
            );
          }

          console.log(`Searching for: ${songName}`);

          // Search for the song
          const result = await this.ytmusic.search(songName);

          console.log("Search results:", result);

          const song = result.find((item) => item.type === "SONG");

          if (!song) {
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "No song found",
              })
            );
          }

          const data = {
            type: "SONG",
            videoId: song.videoId,
            songName: song.name,
            artistName: song.artist?.name || "Unknown Artist",
            thumbnailUrl:
              song.thumbnails?.[song.thumbnails.length - 1]?.url || "",
            roomId: roomId,
            userId: socket.userId,
          };

          const savedStream = await db.streams.upsert({
            where: { videoId: data.videoId },
            update: data as any,
            create: data as any,
          });

          if (!savedStream) {
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "Failed to save stream",
              })
            );
          }

          socket.send(
            JSON.stringify({
              type: "Success",
              message: "Song stored successfully",
              stream: savedStream,
            })
          );
        }
      } catch (err) {
        console.error("Error in SearchSong:", err);
        socket.send(
          JSON.stringify({
            type: "Error",
            message: "Something went wrong",
            error: err,
          })
        );
      }
    });
  }
}
