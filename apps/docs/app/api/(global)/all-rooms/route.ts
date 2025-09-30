import { db } from "@repo/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  const fetchRoom = await db.room.findMany();
  return NextResponse.json({ fetchRoom }, { status: 302 });
}
