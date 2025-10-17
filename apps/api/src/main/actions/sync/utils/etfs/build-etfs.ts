import { HOPIUM } from "@/main/lib/hopium";
import { T_Etf } from "@repo/convex/schema";
import { T_QnLog } from "../../schema";
import { normalizeAddress } from "@repo/common/utils/address";
import { decodeNewEtfLog } from "../logs/filterLogs";
import assert from "assert";
import { buildAssets } from "../assets/build-assets";

export const buildEtfs = async ({ logs }: { logs: T_QnLog[] }) => {
  const etfFactoryAddress = await HOPIUM.contracts.addresses.etfFactory();

  const allEtfs: T_Etf[] = (
    await Promise.all(
      logs.map(async (log) => {
        if (normalizeAddress(log.address) != normalizeAddress(etfFactoryAddress)) {
          return null;
        }

        const decodedLog = decodeNewEtfLog({ log });
        assert(decodedLog.eventName === "EtfDeployed", "Invalid event name");

        const [etfData, etfSnapshot, etfStats] = await Promise.all([
          HOPIUM.fns.etfFactory.fetchEtfData({ etfId: decodedLog.args.etfId }),
          HOPIUM.fns.etfOracle.fetchEtfSnapshot({ etfId: decodedLog.args.etfId }),
          HOPIUM.fns.etfOracle.fetchEtfStats({ etfId: decodedLog.args.etfId }),
        ]);

        const etf: T_Etf = {
          details: {
            etfId: Number(decodedLog.args.etfId),
            name: etfData.name,
            ticker: etfData.ticker,
            assets: buildAssets({ data: etfData, snapshot: etfSnapshot }),
            createdAt: log.timestamp,
          },
          contracts: {
            etfTokenAddress: decodedLog.args.etfTokenAddress,
            etfVaultAddress: decodedLog.args.etfVaultAddress,
          },
          stats: {
            price: {
              eth: etfStats.price.eth,
              usd: etfStats.price.usd,
            },
            volume: {
              eth: etfStats.volume.eth,
              usd: etfStats.volume.usd,
            },
            tvl: {
              eth: etfStats.tvl.eth,
              usd: etfStats.tvl.usd,
            },
            assetsVolumeUsd: 0,
            assetsLiquidityUsd: etfStats.assetsLiquidityUsd,
            assetsMcapUsd: etfStats.assetsMcapUsd,
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
