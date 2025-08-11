import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@repo/db/db";
import { authSchema } from "./validations";
import bcrypt from "bcrypt";
import { any } from "zod";

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
      //@ts-ignore
      async authorize(credentials) {
        const parsed = authSchema.safeParse(credentials);

        if (!parsed.success) throw new Error("Invalid format");

        const { username, email, password } = parsed.data;

        const existUser = await db.user.findUnique({ where: { email } });

        if (existUser) {
          const validPassword = await bcrypt.compare(
            password,
            existUser.password
          );

          if (!validPassword) throw new Error("Invalid Password");

          return {
            message: "login succeed",
            id: existUser.id,
            username: existUser.username,
            email: existUser.email,
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

        return {
          id: createUser.id,
          username: createUser.username,
          email: createUser.email,
        };
      },
    }),
  ],
};
