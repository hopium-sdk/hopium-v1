import { NextResponse, type NextRequest } from "next/server";
import { tryRoute } from "@/main/utils/tryRoute";
import { sync } from "@/main/actions/sync/sync";

export const POST = tryRoute(async (request: NextRequest) => {
  try {
    const body = await request.json();

    await sync({ body });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
