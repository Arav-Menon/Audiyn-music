import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { roomSchema } from "@repo/lib/validation";
import { db } from "@repo/db/db";
import { middleware } from "../../../middleware";

export const createRoomRouter = express.Router();

createRoomRouter.post(
  "/create-room",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.id;

      if (!userId)
        return res
          .status(400)
          .json({ message: "User ID not found in session" });

      const parsedData = roomSchema.safeParse(req.body);
      if (!parsedData.success)
        return res.status(400).json({ error: parsedData.error.issues });

      const { name, code, isPrivate, password } = parsedData.data;

      if (!name || !code)
        return res.status(400).json({ message: "Name and code are required" });

      let hashPassword: string | null = null;
      if (isPrivate && password) {
        hashPassword = await bcrypt.hash(password, 10);
      }

      // Create the room
      const newRoom = await db.room.create({
        data: {
          name,
          code,
          isPrivate,
          password: hashPassword ?? null,
          adminId: userId,
        },
      });

      // Add the admin to the room
      const addAdminInRoom = await db.roomUser.create({
        data: {
          user: { connect: { id: newRoom.adminId } },
          roomId: newRoom.id,
        },
      });

      return res.status(200).json({
        message: "Room created",
        newRoom,
        addAdminInRoom,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }
);
