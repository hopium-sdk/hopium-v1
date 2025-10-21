import { fetchAssetDetailsFromGeckoTerminal } from "@/main/actions/sync/utils/assets/fetch-asset-details";
import { decodeVaultBalanceLog } from "@/main/actions/sync/utils/logs/filter-logs/vault-balance";
import { QN } from "@/main/lib/qn";
import { tryRoute } from "@/main/utils/tryRoute";
import { NextRequest, NextResponse } from "next/server";

export const GET = tryRoute(async () => {
  // const data2 = await QN.getKvList({ key: "hopium-pools" });
  // console.log(data2);

  // await QN.removeFromKvList({
  //   key: "hopium-pools",
  //   values: ["0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C"],
  // });

  const data = await fetchAssetDetailsFromGeckoTerminal({ tokenAddress: "0x1111111111166b7FE7bd91427724B487980aFc69" });
  console.log(data);

  return NextResponse.json({
    message: "test",
  });
});

export const POST = tryRoute(async (request: NextRequest) => {
  const body = await request.json();

  const log = body.log;
  console.log(log);

  const decoded = decodeVaultBalanceLog({ log });
  console.log(decoded);

  return NextResponse.json({
    message: "test",
  });
});
