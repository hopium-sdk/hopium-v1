import { clearAll } from "@/main/actions/clear/clear-all";
import { tryRoute } from "@/main/utils/tryRoute";
import { NextResponse } from "next/server";

export const GET = tryRoute(async () => {
  await clearAll();

  return NextResponse.json({
    message: "All data cleared",
  });
});
