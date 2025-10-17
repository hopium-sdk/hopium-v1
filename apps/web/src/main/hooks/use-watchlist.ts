import { useAddress } from "@/main/hooks/use-address";
import { useMutation, useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { C_WatchlistWithEtf } from "@repo/convex/schema";

export const useWatchlist = () => {
  const { walletAddress } = useAddress();
  const watchlist = useQuery(CONVEX.api.fns.watchlist.getWatchlist.getWatchlist, walletAddress ? { userAddress: walletAddress } : "skip");

  const addToWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.addToWatchlist.addToWatchlist);
  const removeFromWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.removeFromWatchlist.removeFromWatchlist);
  const reorderWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.reorderWatchlist.reorderWatchlist);

  const addToWatchlist = async ({ etfId }: { etfId: number }) => {
    if (!walletAddress || !addToWatchlistMutation) return;
    await addToWatchlistMutation({ userAddress: walletAddress, etfId });
  };

  const removeFromWatchlist = async ({ etfId }: { etfId: number }) => {
    if (!walletAddress || !removeFromWatchlistMutation) return;
    await removeFromWatchlistMutation({ userAddress: walletAddress, etfId });
  };

  const isInWatchlist = ({ etfId }: { etfId: number }) => {
    if (!watchlist) return false;
    return watchlist.items.some((item: C_WatchlistWithEtf["items"][number]) => item.etfId === etfId);
  };

  const reorderWatchlist = async ({ etfId, newIndex }: { etfId: number; newIndex: number }) => {
    if (!walletAddress || !reorderWatchlistMutation) return;
    await reorderWatchlistMutation({ userAddress: walletAddress, etfId, newIndex });
  };

  return { addToWatchlist, removeFromWatchlist, isInWatchlist, watchlist, reorderWatchlist };
};
