import express from "express";
import type { Request, Response } from "express";
import { db } from "@repo/db/db";
import { middleware } from "../../../middleware";

export const dashboardRouter = express.Router();

dashboardRouter.get(
  "/rooms",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.id;

      const rooms = await db.room.findMany({
        where: { adminId: userId },
        include: {
          createdBy: { select: { username: true } },
          _count: { select: { streams: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const roomIds = rooms.map((r) => r.id);
      const memberCounts = await db.roomUser.groupBy({
        by: ["roomId"],
        where: { roomId: { in: roomIds } },
        _count: { id: true },
      });

      const memberCountMap = new Map(
        memberCounts.map((m) => [m.roomId, m._count.id])
      );

      const result = rooms.map((room) => ({
        id: room.id,
        name: room.name,
        code: room.code,
        isPrivate: room.isPrivate,
        createdAt: room.createdAt,
        adminId: room.adminId,
        host: room.createdBy.username,
        streamCount: room._count.streams,
        memberCount: memberCountMap.get(room.id) ?? 0,
      }));

      return res.status(200).json({ rooms: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }
);
