import type { Request, Response } from "express";
import express from "express";
import { db } from "@repo/db/db";
import { middleware } from "../../../middleware";

export const deleteRoomRouter = express.Router();

deleteRoomRouter.delete(
  "/rooms/:roomId",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const userId = req.id;

      const room = await db.room.findUnique({ where: { id: roomId } });
      if (!room) return res.status(404).json({ message: "Room not found" });

      if (room.adminId !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this room" });
      }

      const streams = await db.streams.findMany({
        where: { roomId: room.id },
        select: { id: true },
      });
      const streamIds = streams.map((s) => s.id);

      if (streamIds.length > 0) {
        await db.upvotes.deleteMany({ where: { streamId: { in: streamIds } } });
        await db.streams.deleteMany({ where: { id: { in: streamIds } } });
      }

      await db.roomUser.deleteMany({ where: { roomId: room.id } });
      await db.room.delete({ where: { id: room.id } });

      return res
        .status(200)
        .json({ status: "success", message: "Successfully deleted room" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }
);
