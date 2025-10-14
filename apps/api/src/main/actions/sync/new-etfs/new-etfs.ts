import { T_QnLog } from "../schema";
import { T_Etf } from "@repo/convex/schema";
import { CONVEX } from "@/main/lib/convex";
import { C_HoldingToken, T_HoldingToken } from "@repo/convex/schema";
import { fetchTokenDetails } from "../utils/tokens/fetchTokenDetails";
import { decodeNewEtfLog } from "../utils/logs/filterLogs";
import assert from "assert";
import { HOPIUM } from "@/main/lib/hopium";
import { normalizeAddress } from "@repo/common/utils/address";

export const _syncNewEtfs = async ({ logs }: { logs: T_QnLog[] }) => {
  const allEtfs = await processLogs({ logs });
  const newTokens = await saveNewTokens({ etfs: allEtfs });

  if (newTokens.length > 0) {
    await CONVEX.httpClient.mutation(CONVEX.api.mutations.holdingTokens.upsert.default, {
      tokens: newTokens,
    });
  }

  if (allEtfs.length > 0) {
    await CONVEX.httpClient.mutation(CONVEX.api.mutations.etfs.upsert.default, {
      etfs: allEtfs,
    });
  }

  if (newTokens.length > 0 || allEtfs.length > 0) {
    console.log("Sync success for new etfs");
  }
};

const saveNewTokens = async ({ etfs }: { etfs: T_Etf[] }) => {
  // 1) Build a map of tokenAddress -> min _syncBlockNumber seen across ETFs
  const addressToSyncBlock = new Map<string, number>();
  for (const etf of etfs) {
    for (const holding of etf.index.holdings) {
      const addr = holding.tokenAddress;
      const prev = addressToSyncBlock.get(addr);
      // Use the min block number (earliest ETF appearance)
      const newValue = prev === undefined ? etf.syncBlockNumber_ : Math.min(prev, etf.syncBlockNumber_);
      addressToSyncBlock.set(addr, newValue);
    }
  }

  // 2) De-dupe token addresses
  const candidateAddresses = Array.from(addressToSyncBlock.keys());

  // 3) Filter out tokens we already have
  const existingTokens: C_HoldingToken[] = await CONVEX.httpClient.query(CONVEX.api.fns.holdingTokens.getFromAddresses.default, {
    addresses: candidateAddresses,
  });

  const existingSet = new Set(existingTokens.map((t) => t.address));
  const newTokenAddresses = candidateAddresses.filter((a) => !existingSet.has(a));

  // 4) Fetch details for new tokens, passing earliest syncBlockNumber
  const newTokens: T_HoldingToken[] = await Promise.all(
    newTokenAddresses.map(async (tokenAddress) => {
      const syncBlockNumber = addressToSyncBlock.get(tokenAddress)!;
      const token = await fetchTokenDetails({
        tokenAddress: tokenAddress as `0x${string}`,
        syncBlockNumber, // <-- now the MIN _syncBlockNumber across ETFs
      });
      return token;
    })
  );

  return newTokens;
};

const processLogs = async ({ logs }: { logs: T_QnLog[] }) => {
  const etfFactoryAddress = await HOPIUM.contracts.addresses.etfFactory;

  const allEtfs: T_Etf[] = (
    await Promise.all(
      logs.map(async (log) => {
        if (normalizeAddress(log.address) != normalizeAddress(etfFactoryAddress)) {
          return null;
        }

        const decodedLog = decodeNewEtfLog({ log });
        assert(decodedLog.eventName === "EtfDeployed", "Invalid event name");
        const indexData = await HOPIUM.fns.indexFactory.fetchIndexData({ indexId: decodedLog.args.indexId });

        const indexStats = await fetchIndexStats({ indexId: decodedLog.args.indexId });

        const etf: T_Etf = {
          index: {
            indexId: decodedLog.args.indexId.toString(),
            name: indexData.name,
            ticker: indexData.ticker,
            holdings: indexData.holdings.map((holding) => ({
              tokenAddress: holding.tokenAddress,
              weightBips: holding.weightBips,
            })),
            createdAt: log.timestamp,
          },
          contracts: {
            etfTokenAddress: decodedLog.args.etfTokenAddress,
            etfVaultAddress: decodedLog.args.etfVaultAddress,
          },
          stats: {
            price: {
              eth: indexStats.indexPriceEth,
              usd: indexStats.indexPriceUsd,
            },
            assets_liquidity_usd: indexStats.indexLiquidityUsd,
            assets_mcap_usd: indexStats.indexMcapUsd,
          },
          tags: [],
          syncBlockNumber_: Number(log.blockNumber),
        };

        return etf;
      })
    )
  ).filter((etf) => etf !== null);

  return allEtfs;
};

const fetchIndexStats = async ({ indexId }: { indexId: bigint }) => {
  const [indexPrice, indexLiquidityUsd, indexMcapUsd] = await Promise.all([
    HOPIUM.fns.indexPriceOracle.fetchIndexPrice({ indexId }),
    HOPIUM.fns.indexPriceOracle.fetchIndexLiquidityUsd({ indexId }),
    HOPIUM.fns.indexPriceOracle.fetchIndexMcapUsd({ indexId }),
  ]);

  return {
    indexPriceEth: indexPrice.indexPriceWeth,
    indexPriceUsd: indexPrice.indexPriceUsd,
    indexLiquidityUsd,
    indexMcapUsd,
  };
};
