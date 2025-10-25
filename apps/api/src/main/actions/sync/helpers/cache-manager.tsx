// cache-manager.ts
import { deepOmit, Path } from "deep-pick-omit";
import { C_Asset, C_Etf, C_EtfTokenTransfer, T_Asset, T_Etf, T_EtfTokenTransfer, T_OhlcUpdates } from "@repo/convex/schema";
import { C_Pool, T_Pool } from "../../../../../../../packages/convex/convex/schema/pools";
import { normalizeAddress } from "@repo/common/utils/address";
import { HOPIUM } from "@/main/lib/hopium";
import { C_Affiliate, C_AffiliateTransfers, T_Affiliate, T_AffiliateTransfers } from "@repo/convex/schema";

type T_Entities = {
  etf: { c: C_Etf; t: T_Etf };
  asset: { c: C_Asset; t: T_Asset };
  etf_token_transfer: { c: C_EtfTokenTransfer; t: T_EtfTokenTransfer };
  pool: { c: C_Pool; t: T_Pool };
  ohlc_updates: { c: T_OhlcUpdates; t: T_OhlcUpdates };
  affiliate_transfers: { c: C_AffiliateTransfers; t: T_AffiliateTransfers };
  affiliate: { c: C_Affiliate; t: T_Affiliate };
};

// ---------- NEW: per-block staging shape ----------
type BlockStage = {
  etfs: Map<string, T_Etf>;
  assets: Map<string, T_Asset>;
  pools: Map<string, T_Pool>;
  etf_token_transfers: Map<string, T_EtfTokenTransfer>;
  ohlc_updates: T_OhlcUpdates[]; // append list
  affiliate_transfers: Map<string, T_AffiliateTransfers>; // append list
  affiliate: Map<string, T_Affiliate>;
};

const newBlockStage = (): BlockStage => ({
  etfs: new Map(),
  assets: new Map(),
  pools: new Map(),
  etf_token_transfers: new Map(),
  ohlc_updates: [],
  affiliate_transfers: new Map(),
  affiliate: new Map(),
});

class CacheMapping {
  public readonly cache: { [K in keyof T_Entities]: Map<string, T_Entities[K]["t"]> } = {
    etf: new Map(),
    asset: new Map(),
    etf_token_transfer: new Map(),
    pool: new Map(),
    ohlc_updates: new Map(),
    affiliate_transfers: new Map(),
    affiliate: new Map(),
  };

  // ---------- NEW: per-block staging ----------
  private readonly perBlock: Map<number, BlockStage> = new Map();

  public ethUsdPoolAddress: string | null = null;

  /**
   * Backward compatible: if blockNumber is omitted, behaves like the old cache (preload/use).
   * If blockNumber is provided, also stages the value into that block's payload.
   */
  public addEntity = <E extends keyof T_Entities>({
    entity,
    id,
    value,
    blockNumber,
  }: {
    entity: E;
    id: string;
    value: T_Entities[E]["t"];
    blockNumber?: number; // <-- NEW
  }) => {
    this.cache[entity].set(id, value);

    if (blockNumber !== undefined) {
      const bn = Number(blockNumber);
      let stage = this.perBlock.get(bn);
      if (!stage) {
        stage = newBlockStage();
        this.perBlock.set(bn, stage);
      }

      switch (entity) {
        case "etf":
          stage.etfs.set(id, value as T_Etf);
          break;
        case "asset":
          stage.assets.set(id, value as T_Asset);
          break;
        case "pool":
          stage.pools.set(id, value as T_Pool);
          break;
        case "etf_token_transfer":
          stage.etf_token_transfers.set(id, value as T_EtfTokenTransfer); // idempotent by docId
          break;
        case "ohlc_updates":
          stage.ohlc_updates.push(value as T_OhlcUpdates); // append each tick/update
          break;
        case "affiliate_transfers":
          stage.affiliate_transfers.set(id, value as T_AffiliateTransfers); // append each transfer
          break;
        case "affiliate":
          stage.affiliate.set(id, value as T_Affiliate);
          break;
      }
    }
  };

  public getEntity = <E extends keyof T_Entities>({ entity, id }: { entity: E; id: string }): T_Entities[E]["t"] | undefined => {
    return this.cache[entity].get(id);
  };

  public getAllEntities = <E extends keyof T_Entities>({ entity }: { entity: E }): T_Entities[E]["t"][] => {
    return Array.from(this.cache[entity].values()) as T_Entities[E]["t"][];
  };

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public convertCtoT = <E extends keyof T_Entities>({ entity, c }: { entity: E; c: T_Entities[E]["c"] }): T_Entities[E]["t"] => {
    return deepOmit<T_Entities[E]["c"]>(c, ["_id", "_creationTime"] as Path<T_Entities[E]["c"]>[]) as T_Entities[E]["t"];
  };

  // ---------- NEW: build BlockPayload[] ----------
  public buildBlockPayloads = () => {
    const entries = Array.from(this.perBlock.entries());
    entries.sort((a, b) => a[0] - b[0]); // ascending blockNumber

    return entries.map(([blockNumber, stage]) => ({
      blockNumber,
      etfs: Array.from(stage.etfs.values()),
      assets: Array.from(stage.assets.values()),
      pools: Array.from(stage.pools.values()),
      etfTokenTransfers: Array.from(stage.etf_token_transfers.values()),
      ohlcUpdates: stage.ohlc_updates.slice(),
      affiliateTransfers: Array.from(stage.affiliate_transfers.values()),
      affiliates: Array.from(stage.affiliate.values()),
    }));
  };

  // (optionally) clear staged blocks after successful push
  public clearStagedBlocks = () => this.perBlock.clear();
}

type T_AddressKey = keyof typeof HOPIUM.contracts.addresses;
class CacheAddresses extends CacheMapping {
  public readonly addresses: Map<T_AddressKey, string> = new Map();

  public preloadAddresses = async () => {
    const fetchers = HOPIUM.contracts.addresses;

    const entries = await Promise.all(
      (Object.entries(fetchers) as [T_AddressKey, () => Promise<string>][]).map(async ([key, fn]) => {
        const addr = await fn();
        return [key, addr] as const;
      })
    );

    for (const [key, addr] of entries) {
      this.addresses.set(key, normalizeAddress(addr));
    }

    return Object.fromEntries(this.addresses);
  };

  public getAddress = ({ key }: { key: T_AddressKey }): string => {
    const address = this.addresses.get(key);
    if (!address) {
      throw new Error(`Address for ${key} not found`);
    }
    return address;
  };
}

export class CacheManager extends CacheAddresses {
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
