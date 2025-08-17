import { db } from "@repo/db/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authSchema } from "@repo/lib/validation";
import bcrypt from "bcrypt";

export async function GET() {
  const session = await getServerSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const getProfile = await db.user.findUnique({
      where: { email: session.user?.email as string },
      select: { username: true, email: true },
    });

    return NextResponse.json({ getProfile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (!session)
    return NextResponse.json({ error: "Unautorized" }, { status: 404 });

  try {
    const body = await req.json();
    const parsedData = authSchema.safeParse(body);

    if (!parsedData.success)
      return NextResponse.json({
        error: parsedData.error.issues,
      });

    const findUser = await db.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!findUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashPassword = await bcrypt.hash(findUser.password, 10);

    const updateUser = await db.user.update({
      where: { email: session.user?.email as string },
      data: parsedData.data,
      select: {
        username: true,
        email: true,
        password: true,
      },
    });

    return NextResponse.json(
      {
        message: "user updated",
        updateUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}

export async function DELETE() {
  const session = await getServerSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });

  try {
    const deleteUser = await db.user.delete({
      where: { email: session.user?.email as string },
    });
    return NextResponse.json({
      message: "User deleted",
      deleteUser,
    });
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}
