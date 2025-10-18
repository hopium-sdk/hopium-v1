import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_Etf } from "../../schema/etf";
import { _getAssetsByAddresses } from "./fns/getAssetsByAddresses";
import { _getEtfsByIds } from "./fns/getEtfsByIds";
import { _getEtfsAndSupplyByPoolAddresses } from "./fns/getEtfsAndSupplyByPoolAddreses";
import { _getPoolsByAddresses } from "./fns/getPoolsByAddresses";
import { _getWethUsdPool } from "./fns/getWethUsdPool";
import { C_Pool } from "../../schema/pools";

export default query({
  args: {
    etfIds: v.array(v.number()),
    assetAddresses: v.array(v.string()),
    poolAddresses: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const [etfsByIds, assetsByAddresses, poolsByAddresses, etfsAndSupplyByPoolAddresses, wethUsdPool] = await Promise.all([
      args.etfIds.length > 0 ? _getEtfsByIds({ ctx, etfIds: args.etfIds }) : Promise.resolve([]),
      args.assetAddresses.length > 0 ? _getAssetsByAddresses({ ctx, assetAddresses: args.assetAddresses }) : Promise.resolve([]),
      args.poolAddresses.length > 0 ? _getPoolsByAddresses({ ctx, poolAddresses: args.poolAddresses }) : Promise.resolve([]),
      args.poolAddresses.length > 0
        ? _getEtfsAndSupplyByPoolAddresses({ ctx, poolAddresses: args.poolAddresses })
        : Promise.resolve({ etfs: [], etfSupplyMap: {} }),
      _getWethUsdPool({ ctx }),
    ]);

    return {
      etfs: _uniq<C_Etf>(etfsByIds.concat(etfsAndSupplyByPoolAddresses.etfs), "details.etfId"),
      assets: assetsByAddresses,
      pools: _uniq<C_Pool>(poolsByAddresses.concat(wethUsdPool ? [wethUsdPool] : []), "address"),
      etfSupplyMap: etfsAndSupplyByPoolAddresses.etfSupplyMap,
    };
  },
});

const _uniq = <T>(arr: readonly T[], key: string) => {
  const map = new Map<string, T>();
  for (const item of arr) {
    map.set(item[key as keyof T] as string, item);
  }
  return Array.from(map.values());
};
