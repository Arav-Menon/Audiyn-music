import { db } from "@repo/db/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session) return NextResponse.json({ message: "user not authenticated" });

  const findRooms = await db.room.findMany({
    where: {
      id: session.user.id,
    },
  });

  return NextResponse.json(
    {
      findRooms,
    },
    { status: 302 }
  );
}
