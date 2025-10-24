import express from "express";
import YTMusic from "ytmusic-api";
import { middleware } from "../../middleware";
import { db } from "@repo/db/db";

enum StreamType {
  VIDEO = "VIDEO",
  SONG = "SONG",
  PLAYLIST = "PLAYLIST",
  ARTIST = "ARTIST",
  ALBUM = "ALBUM",
}

const ytmusic = new YTMusic();
await ytmusic.initialize();

export const musicApi = express.Router();

musicApi.get("/play-song", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ err: "query is required" });

    const musicResult = await ytmusic.search(query as string);

    for(const item of musicResult) {
      await db.streams.create({
        data : {
          type : item.type,
          videoId : item.videoId,
          songName : item.name,
          artistName : item.artist,
          thumbnailUrl : item.thumbnails,
          roomId : {
            
          }

        }
      })
    }

    res.status(200).json(musicResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", err });
  }
});
