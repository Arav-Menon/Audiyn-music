import express from "express";
import { authSchema } from "@repo/lib/validation";
import jwt from "jsonwebtoken";
import { db } from "@repo/db/db";
import bcrypt from "bcrypt";
import "dotenv/config";

const secrect = process.env.AUTH_TOKEN;

console.log(secrect);

export const userRouter = express();

userRouter.post("/auth", async (req, res) => {
  try {
    const body = req.body;
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      return res.status(409).json({ Error: parsed.error });
    }

    const { username, email, password } = parsed.data;

    const existUser = await db.user.findUnique({
      where: { email },
    });

    if (existUser) {
      const compareHashPassword = await bcrypt.compare(
        password,
        existUser.password
      );
      if (!compareHashPassword) {
        return res.status(401).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        {
          id: existUser.id,
        },
        process.env.AUTH_TOKEN!
      );

      return res.status(200).json({
        message: "Login succesful",
        user: {
          id: existUser.id,
          email: existUser.email,
        },
        token,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username: username ?? "",
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.AUTH_TOKEN!
    );

    res.status(200).json({
      newUser: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
