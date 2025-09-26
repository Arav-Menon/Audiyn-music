import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import { db } from "@repo/db/db";
import { authSchema } from "./validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const result = authSchema.safeParse(credentials);
        console.log(result);

        if (!result.success) return null;

        const { username, email, password } = result.data;

        const existUser = await db.user.findUnique({ where: { email } });

        if (existUser) {
          const validPassword = await bcrypt.compare(
            password,
            existUser.password
          );

          if (!validPassword) throw new Error("Invalid Password");

          const token = jwt.sign(
            {
              user_id: existUser.id,
            },
            process.env.NEXTAUTH_SECRET!
          );

          return {
            id: existUser.id,
            username: existUser.username,
            email: existUser.email,
            token,
          };
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await db.user.create({
          data: {
            username,
            email,
            password: hashPassword,
          },
        });

        const token = jwt.sign(
          {
            user_id: createUser.id,
          },
          process.env.NEXTAUTH_SECRET!
        );

        return {
          id: createUser.id,
          username: createUser.username,
          email: createUser.email,
          token,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
