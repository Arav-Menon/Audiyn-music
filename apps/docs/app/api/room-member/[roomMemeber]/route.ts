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

    

  } catch (error) {
    NextResponse.json({ error: error });
  }
}
