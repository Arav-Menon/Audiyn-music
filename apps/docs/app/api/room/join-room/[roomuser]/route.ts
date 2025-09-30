import { db } from "@repo/db/db";
import { authOptions } from "@repo/lib/auth";
import { roomJoinSchema } from "@repo/lib/validation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsedData = roomJoinSchema.safeParse(body);

    if (!parsedData.success)
      return NextResponse.json({ erorr: parsedData.error.issues });

    const { code, password } = parsedData.data;

    const findRoom = await db.room.findUnique({
      where: { code },
    });

    if (!findRoom)
      return NextResponse.json({ message: "Room not found" }, { status: 404 });

    const isUserAlreadyExist = await db.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: findRoom.id,
        },
      },
    });

    if (isUserAlreadyExist)
      return NextResponse.json(
        {
          message: ` this user ${isUserAlreadyExist.id} is already exist `,
        },
        { status: 409 }
      );

    if (findRoom.isPrivate == true) {
      if (!password || password !== findRoom.password) {
        return NextResponse.json({ message: "Password is incorrect" });
      }

      await db.roomUser.create({
        data: {
          user: {
            connect: {
              id: session.user.id,
            },
          },
          roomId: findRoom.id,
        },
      });

      return NextResponse.json(
        {
          message: `User joined room ${findRoom.name} sucessfully `,
        },
        { status: 200 }
      );
    }

    await db.roomUser.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        roomId: findRoom.id,
      },
    });

    return NextResponse.json({
      message: `User joined room ${findRoom.name} sucessfully `,
    });
  } catch (error) {
    NextResponse.json({ error: error });
  }
}
