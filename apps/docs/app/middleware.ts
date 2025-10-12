import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    return NextResponse.next();
  } catch (error) {
    NextResponse.json(error, { status: 500 });
    console.log(error);
  }
};

export const config = {
  matcher: ["/api/:path*"],
};
