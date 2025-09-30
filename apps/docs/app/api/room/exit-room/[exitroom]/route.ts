import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@repo/db/db";

export async function DELETE({ params }: { params: { roomId: string } }) {
  const session = await getServerSession();

  if (!session)
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 403 }
    );

  const { roomId } = params;

  const findUserInRoom = await db.roomUser.findFirst({
    where: {
      userId: session.user.id,
    },
  });
  if (!findUserInRoom) {
    return NextResponse.json({ message: "user not found " }, { status: 404 });
  }

  if (findUserInRoom?.roomId == roomId) {
    await db.roomUser.delete({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: findUserInRoom.roomId,
        },
      },
    });
  }

  return NextResponse.json(
    {
      message: "user exited",
    },
    { status: 200 }
  );
}
