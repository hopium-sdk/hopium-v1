import { query } from "../../_generated/server";
import { v } from "convex/values";
import { C_Etf } from "../../schema/etf";
import { _getAssetsByAddresses } from "./fns/getAssetsByAddresses";
import { _getEtfsByIds } from "./fns/getEtfsByIds";
import { _getEtfsByPoolAddresses } from "./fns/getEtfsByPoolAddreses";
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
    const [etfsByIds, assetsByAddresses, poolsByAddresses, etfsByPoolAddresses, wethUsdPool] = await Promise.all([
      args.etfIds.length > 0 ? _getEtfsByIds({ ctx, etfIds: args.etfIds }) : Promise.resolve([]),
      args.assetAddresses.length > 0 ? _getAssetsByAddresses({ ctx, assetAddresses: args.assetAddresses }) : Promise.resolve([]),
      args.poolAddresses.length > 0 ? _getPoolsByAddresses({ ctx, poolAddresses: args.poolAddresses }) : Promise.resolve([]),
      args.poolAddresses.length > 0 ? _getEtfsByPoolAddresses({ ctx, poolAddresses: args.poolAddresses }) : Promise.resolve([]),
      _getWethUsdPool({ ctx }),
    ]);

    return {
      etfs: _uniq<C_Etf>(etfsByIds.concat(etfsByPoolAddresses), "details.etfId"),
      assets: assetsByAddresses,
      pools: _uniq<C_Pool>(poolsByAddresses.concat(wethUsdPool ? [wethUsdPool] : []), "address"),
    };
  },
});

const _uniq = <T>(arr: readonly T[], path: string) => {
  const map = new Map<string, T>();
  for (const item of arr) {
    const k = _getByPath(item, path);
    map.set(String(k), item);
  }
  return Array.from(map.values());
};

const _getByPath = (obj: any, path: string) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
