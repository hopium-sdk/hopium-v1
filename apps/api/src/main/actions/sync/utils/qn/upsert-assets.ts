import { CONSTANTS } from "@/main/lib/constants";
import { QN } from "@/main/lib/qn";

export const upsertPoolsToQn = async ({ addresses }: { addresses: string[] }) => {
  await QN.upsertKvList({
    key: CONSTANTS.qn.poolKey,
    values: addresses,
  });
};

export const removeAllPoolsFromQn = async () => {
  const pools = await QN.getKvList({ key: CONSTANTS.qn.poolKey });
  if (pools.length > 0) {
    await QN.removeFromKvList({
      key: CONSTANTS.qn.poolKey,
      values: pools,
    });
  }
};

export const getPoolsListFromQn = async () => {
  return await QN.getKvList({ key: CONSTANTS.qn.poolKey });
};
