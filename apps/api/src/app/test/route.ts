import { tryRoute } from "@/main/utils/tryRoute";
import { NextResponse } from "next/server";

export const GET = tryRoute(async () => {
  return NextResponse.json({
    message: "test",
  });
});
