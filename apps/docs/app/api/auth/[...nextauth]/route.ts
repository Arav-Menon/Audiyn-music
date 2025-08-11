import NextAuth from "next-auth";
import { authOptions } from "@repo/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
