import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import { db } from "@repo/db/db";
import { authSchema } from "./validations";
import bcrypt from "bcrypt";

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

          return {
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

    GoogleProvider({
      clientId:
        "74315573190-3giosieo1b9q1j9t0gupaqckntqnqi9c.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "o9WuIIInMWoA5jSbOj6M",

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
        } as any;
      }
      return session;
    },
  },
};
