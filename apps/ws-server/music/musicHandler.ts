import type { WebSocket } from "ws";
import YTMusic from "ytmusic-api";
import { SEARCH_SONG } from "../lib";

export class MusicHandler {
  private static ytmusic: YTMusic;
  private static isInitialized = false;

  static async initialize() {
    if (!this.isInitialized) {
      try {
        this.ytmusic = new YTMusic();
        await this.ytmusic.initialize();

        const cfg = (this.ytmusic as any).config || {};
        if (!cfg.INNERTUBE_API_KEY) cfg.INNERTUBE_API_KEY = "AIzaSyC9XL3ZjBddKy4J4H1XhPsMtvZvGnKAPyQ";
        if (!cfg.INNERTUBE_CLIENT_VERSION) cfg.INNERTUBE_CLIENT_VERSION = "1.20250101.00.00";
        if (!cfg.INNERTUBE_CLIENT_NAME) cfg.INNERTUBE_CLIENT_NAME = "WEB_REMIX";
        if (!cfg.INNERTUBE_API_VERSION) cfg.INNERTUBE_API_VERSION = "v1";
        if (!cfg.INNERTUBE_CONTEXT_CLIENT_NAME) cfg.INNERTUBE_CONTEXT_CLIENT_NAME = 67;

        this.isInitialized = true;
        console.log("YTMusic initialized successfully");
      } catch (error) {
        console.error("Failed to initialize YTMusic:", error);
        throw error;
      }
    }
  }

  static async SearchSong(socket: WebSocket) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === SEARCH_SONG) {
          const { songName } = message.payload || {};

          if (!songName) {
            return socket.send(
              JSON.stringify({
                type: "Error",
                message: "Song name is required",
              })
            );
          }

          const result = await this.ytmusic.search(songName);

          const songs = result
            .filter((item: any) => item.type === "SONG")
            .slice(0, 10)
            .map((item: any) => ({
              videoId: item.videoId,
              title: item.name,
              artist: item.artist?.name || "Unknown Artist",
              thumbnail: item.thumbnails?.[item.thumbnails.length - 1]?.url || "",
              duration: item.duration,
            }));

          socket.send(
            JSON.stringify({
              type: "SONG_RESULTS",
              payload: { songs },
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
