import { deepOmit, Path } from "deep-pick-omit";
import { C_Asset, C_Etf, C_EtfTokenTransfer, T_Asset, T_Etf, T_EtfTokenTransfer, T_OhlcUpdates } from "@repo/convex/schema";
import { C_Pool, T_Pool } from "../../../../../../../packages/convex/convex/schema/pools";
import { normalizeAddress } from "@repo/common/utils/address";

type T_Entities = {
  etf: {
    c: C_Etf;
    t: T_Etf;
  };
  asset: {
    c: C_Asset;
    t: T_Asset;
  };
  etf_token_transfer: {
    c: C_EtfTokenTransfer;
    t: T_EtfTokenTransfer;
  };
  pool: {
    c: C_Pool;
    t: T_Pool;
  };
  ohlc_updates: {
    c: T_OhlcUpdates;
    t: T_OhlcUpdates;
  };
};

class CacheMapping {
  public readonly cache: { [K in keyof T_Entities]: Map<string, T_Entities[K]["t"]> } = {
    etf: new Map(),
    asset: new Map(),
    etf_token_transfer: new Map(),
    pool: new Map(),
    ohlc_updates: new Map(),
  };
  public ethUsdPoolAddress: string | null = null;

  public addEntity = <E extends keyof T_Entities>({ entity, id, value }: { entity: E; id: string; value: T_Entities[E]["t"] }) => {
    this.cache[entity].set(id, value);
  };

  public getEntity = <E extends keyof T_Entities>({ entity, id }: { entity: E; id: string }): T_Entities[E]["t"] | undefined => {
    return this.cache[entity].get(id);
  };

  public getAllEntities = <E extends keyof T_Entities>({ entity }: { entity: E }): T_Entities[E]["t"][] => {
    return Array.from(this.cache[entity].values()) as T_Entities[E]["t"][];
  };

  public convertCtoT = <E extends keyof T_Entities>({ entity, c }: { entity: E; c: T_Entities[E]["c"] }): T_Entities[E]["t"] => {
    return deepOmit<T_Entities[E]["c"]>(c, ["_id", "_creationTime"] as Path<T_Entities[E]["c"]>[]) as T_Entities[E]["t"];
  };
}

export class CacheManager extends CacheMapping {
  public readonly etfSupplyMap: Map<string, number> = new Map();

  public updateEthUsdPoolAddress = ({ address }: { address: string }) => {
    this.ethUsdPoolAddress = normalizeAddress(address);
  };

  public getEthPrice = () => {
    if (this.ethUsdPoolAddress) {
      const pool = this.getEntity({ entity: "pool", id: normalizeAddress(this.ethUsdPoolAddress) });
      if (!pool) return 0;
      return pool.stats.price.usd;
    }

    return 0;
  };

  // ---- Etf Supply Map ----

  public getEtfSupply = ({ etfTokenAddress }: { etfTokenAddress: string }): number => {
    return this.etfSupplyMap.get(normalizeAddress(etfTokenAddress)) ?? 0;
  };

  public updateEtfSupply = ({ etfTokenAddress, totalSupply }: { etfTokenAddress: string; totalSupply: number }) => {
    this.etfSupplyMap.set(normalizeAddress(etfTokenAddress), totalSupply);
  };
}
