// utils/tryRoute.ts
import { NextResponse, NextRequest } from "next/server";
import { parseError } from "./error";

export const tryRoute = (handler: (req: NextRequest) => Promise<NextResponse>) => async (req: NextRequest) => {
  try {
    return await handler(req);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: parseError(error) }, { status: 500 });
  }
};
