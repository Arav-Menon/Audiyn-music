import express from "express";
import type { Request, Response } from "express";
import { db } from "@repo/db/db";
import { middleware } from "../../../middleware";

export const deleteUserRouter = express.Router();

deleteUserRouter.delete(
  "/profile/delete/:userId",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.id;

      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Remove user from any rooms
      const roomJoins = await db.roomUser.findMany({ where: { userId } });
      for (const join of roomJoins) {
        await db.roomUser.delete({
          where: {
            userId_roomId: { userId: join.id, roomId: join.roomId },
          },
        });
      }

      const deletedUser = await db.user.delete({ where: { id: userId } });

      return res.status(200).json({ message: "User deleted", deletedUser });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);
