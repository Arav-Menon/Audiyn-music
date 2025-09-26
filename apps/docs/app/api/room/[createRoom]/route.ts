import { roomSchema } from "@repo/lib/validation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db/db";
import { authOptions } from "@repo/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsedData = roomSchema.safeParse(body);

    if (!parsedData.success)
      return NextResponse.json({ error: parsedData.error.issues });

    const { name, code, isPrivate, password } = parsedData.data;

    if (!name || !code)
      return NextResponse.json(
        { message: "Name and code are required" },
        { status: 404 }
      );

    let hashPassword: string | null = null;

    if (isPrivate && password) {
      hashPassword = await bcrypt.hash(password, 10);
    }

    // Type assertion to include 'id' on user
    const userId = (session.user as typeof session.user & { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }
    // The callbacks property you mentioned should be added to your NextAuth configuration,
    // typically in your authOptions object (not here in the route handler).
    // Here, you don't need to add anything extra.

    const newRoom = await db.room.create({
      data: {
        name,
        code,
        isPrivate,
        password: hashPassword ?? null,
        participants: {
          connect: {
            id: userId,
          },
        },
        createdById: userId,
      },
    });

    const addAdminInRoom = await db.roomUser.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        room: {
          connect: {
            id: newRoom.id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Room created",
        newRoom: newRoom,
        addAdminInRoom: addAdminInRoom,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: error }, { status: 500 });
  }
}
