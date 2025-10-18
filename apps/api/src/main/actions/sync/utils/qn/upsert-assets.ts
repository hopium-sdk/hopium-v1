import { QN } from "@/main/lib/qn";

// export const upsertAssetsToQn = async ({ addresses }: { addresses: string[] }) => {
//   await QN.upsertKvList({
//     key: "hopium-assets",
//     values: addresses,
//   });
// };

export const upsertPoolsToQn = async ({ addresses }: { addresses: string[] }) => {
  await QN.upsertKvList({
    key: "hopium-pools",
    values: addresses,
  });
};
