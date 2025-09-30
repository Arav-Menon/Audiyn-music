import { NextResponse } from "next/server";
import { db } from "@repo/db/db";
import { getServerSession } from "next-auth";
import { json } from "stream/consumers";

export async function DELETE({ params }: { params: { roomId: string } }) {
  const session = await getServerSession();

  if (!session)
    return NextResponse.json(
      { message: "User is not authenticated" },
      { status: 404 }
    );

  try {
    const { roomId } = params;

    const findRoom = await db.room.findMany({ where: { id: roomId } });

    console.log(findRoom);

    if (!findRoom)
      return NextResponse.json({ message: "Room not found" }, { status: 404 });

    const room = findRoom[0];

    if (!room)
      return NextResponse.json({ message: "Room not found" }, { status: 404 });

    if (session.user.id === room.createdById) {
      const deleteRoom = await db.room.delete({
        where: {
          id: room.id,
        },
      });

      console.log(deleteRoom);

      // Remove all users from the room
      await db.roomUser.deleteMany({
        where: {
          roomId: room.id,
        },
      });
    } else {
      return NextResponse.json(
        { message: "You are not authorized to delete this room" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(
    {
      status: "success",
      message: "Successfully deleted room",
    },
    { status: 204 }
  );
}
