import express from "express";
import type { Request, Response } from "express";
import { db } from "@repo/db/db";
import { authSchema } from "@repo/lib/validation";
import bcrypt from "bcrypt";
import { middleware } from "../../../middleware";

export const updateUserRouter = express.Router();

updateUserRouter.put(
  "/profile/update/:userId",
  middleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.id;
      const parsed = authSchema.safeParse(req.body);
      if (!parsed.success)
        return res.status(400).json({ error: parsed.error.issues });

      // If password is provided, hash it
      if (parsed.data.password) {
        parsed.data.password = await bcrypt.hash(parsed.data.password, 10);
      }

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: parsed.data,
        select: { username: true, email: true, password: true },
      });

      return res.status(200).json({ message: "User updated", updatedUser });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);
