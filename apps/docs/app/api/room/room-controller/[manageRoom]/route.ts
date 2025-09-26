import { authOptions } from "@repo/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// exit from room
// delete room

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
  } catch (error) {
    NextResponse.json({ error: error }, { status: 500 });
  }
}
