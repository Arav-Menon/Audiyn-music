import type { WebSocket } from "ws";
import YTMusic from "ytmusic-api";
import { SEARCH_SONG } from "../lib";
import { db } from "@repo/db/db";

export class MusicHandler {
  private static ytmusic: YTMusic;

  static async initialize() {
    this.ytmusic = new YTMusic();
  }

  static SearchSong(socket: WebSocket) {
    console.log("Request is comming here");
    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type == SEARCH_SONG) {
          const { songName, roomId } = message.payload || {};

          if (!songName || !roomId) return socket.send("Payload is missing");

          const result = await this.ytmusic.search(songName);

          console.log(result);

          const song = result.find((item) => item.type === "SONG");

          if (!song)
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "No song found",
              })
            );

          const data = {
            type: "SONG",
            videoId: song.videoId,
            songName: song.name,
            artistName: song.artist?.name || "Unknown Artist",
            thumbnailUrl:
              song.thumbnails?.[song.thumbnails.length - 1]?.url || "",
            roomId: roomId as string | undefined,
            userId: socket.userId,
          };

          const savedStream = await db.streams.upsert({
            where: { videoId: data.videoId },
            update: data as any,
            create: data as any,
          });

          if (!savedStream) return socket.close(4002, "Something got wrong");

          socket.send(
            JSON.stringify({
              message: "Song stored successfully",
              stream: savedStream,
            })
          );
        }
      } catch (err) {
        console.log(err);
        socket.close(4002, "Something got wrong");
      }
    });
  }
}
