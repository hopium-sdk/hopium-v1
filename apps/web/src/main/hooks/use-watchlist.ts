import { useMutation, useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { C_WatchlistWithEtf } from "@repo/convex/schema";
import { useAccount } from "wagmi";

export const useWatchlist = () => {
  const { address } = useAccount();
  const watchlist = useQuery(CONVEX.api.fns.watchlist.getWatchlist.getWatchlist, address ? { userAddress: address } : "skip");

  const addToWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.addToWatchlist.addToWatchlist);
  const removeFromWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.removeFromWatchlist.removeFromWatchlist);
  const reorderWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.reorderWatchlist.reorderWatchlist);

  const addToWatchlist = async ({ etfId }: { etfId: number }) => {
    if (!address || !addToWatchlistMutation) return;
    await addToWatchlistMutation({ userAddress: address, etfId });
  };

  const removeFromWatchlist = async ({ etfId }: { etfId: number }) => {
    if (!address || !removeFromWatchlistMutation) return;
    await removeFromWatchlistMutation({ userAddress: address, etfId });
  };

  const isInWatchlist = ({ etfId }: { etfId: number }) => {
    if (!watchlist) return false;
    return watchlist.items.some((item: C_WatchlistWithEtf["items"][number]) => item.etfId === etfId);
  };

  const reorderWatchlist = async ({ etfId, newIndex }: { etfId: number; newIndex: number }) => {
    if (!address || !reorderWatchlistMutation) return;
    await reorderWatchlistMutation({ userAddress: address, etfId, newIndex });
  };

  return { addToWatchlist, removeFromWatchlist, isInWatchlist, watchlist, reorderWatchlist };
};
