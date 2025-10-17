import { QN } from "@/main/lib/qn";
import { tryRoute } from "@/main/utils/tryRoute";
import { NextResponse } from "next/server";

export const GET = tryRoute(async () => {
  // await QN.createKvList({ key: "test2", value: ["test1", "test2", "test3"] });

  const data = await QN.upsertKvList({ key: "hopium-assets", values: [] });
  console.log(data);

  const data2 = await QN.getKvList({ key: "hopium-assets" });
  console.log(data2);

  // const data = await QN.getAllKvLists();
  // console.log(data);

  // const data = await QN.addToKvList({ key: "test", value: "test4" });
  // console.log(data);

  return NextResponse.json({
    message: "test",
  });
});
