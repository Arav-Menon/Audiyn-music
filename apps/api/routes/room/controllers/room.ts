import express from "express";
import { db } from "@repo/db/db";
import { middleware } from "../../../middleware";

export const getRoomRouter = express.Router();

getRoomRouter.get("/:roomId", middleware, async (req, res) => {
  const { roomId } = req.params;
  const userId = req.id;
  try {
    const userRoom = await db.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!userRoom) return res.status(404).json({ message: "room not found" });

    const havePermission = userRoom?.adminId == userId;

    // if (havePermission) {
    //   res.status(201).json({
    //     message: "user room",
    //     room: userRoom,
    //     admin: {
    //       username: userRoom.createdBy.username,
    //     },
    //   });
    // } else {
    //   res.status(401).json({
    //     message: "you don't have permission to access this room",
    //   });
    // }
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
