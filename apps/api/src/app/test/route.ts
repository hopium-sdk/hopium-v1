import { QN } from "@/main/lib/qn";
import { tryRoute } from "@/main/utils/tryRoute";
import { NextResponse } from "next/server";

export const GET = tryRoute(async () => {
  const data2 = await QN.getKvList({ key: "hopium-pools" });
  console.log(data2);

  // await QN.removeFromKvList({
  //   key: "hopium-pools",
  //   values: ["0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C"],
  // });

  return NextResponse.json({
    message: "test",
  });
});
