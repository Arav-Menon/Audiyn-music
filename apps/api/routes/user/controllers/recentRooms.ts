import express from "express";
import type { Request, Response } from "express";
import { db } from "@repo/db/db";
import { middleware } from "../../../middleware";

export const recentRoomsRouter = express.Router();

recentRoomsRouter.get(
  "/recent-rooms",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.id;

      const recentRooms = await db.recentRoom.findMany({
        where: { userId },
        include: { room: true },
        orderBy: { lastJoinedAt: "desc" },
        take: 20,
      });

      const result = recentRooms
        .filter((r) => r.room !== null)
        .map((r) => ({
          id: r.id,
          roomId: r.roomId,
          roomName: r.roomName,
          roomCode: r.roomCode,
          hostName: r.hostName,
          lastJoinedAt: r.lastJoinedAt,
        }));

      return res.status(200).json({ recentRooms: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }
);

recentRoomsRouter.delete(
  "/recent-rooms/:roomId",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.id;
      const { roomId } = req.params;

      await db.recentRoom.deleteMany({
        where: { userId, roomId },
      });

      return res.status(200).json({ status: "success" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }
);
