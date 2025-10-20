import { _updateEtfStats } from "@/main/actions/update/etf-stats/update-etf-stats";
import { tryRoute } from "@/main/utils/tryRoute";
import { NextResponse } from "next/server";

export const GET = tryRoute(async () => {
  await _updateEtfStats();

  return NextResponse.json({
    message: "Etf stats updated",
  });
});
