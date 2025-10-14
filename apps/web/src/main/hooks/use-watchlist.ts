import { useAddress } from "@/main/hooks/use-address";
import { useMutation, useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { C_WatchlistWithEtf } from "@repo/convex/schema";

export const useWatchlist = () => {
  const { walletAddress } = useAddress();
  const watchlist = useQuery(CONVEX.api.fns.watchlist.getWatchlist.getWatchlist, { user_address: walletAddress ?? "skip" });

  const addToWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.addToWatchlist.addToWatchlist);
  const removeFromWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.removeFromWatchlist.removeFromWatchlist);
  const reorderWatchlistMutation = useMutation(CONVEX.api.mutations.watchlist.reorderWatchlist.reorderWatchlist);

  const addToWatchlist = async ({ index_id }: { index_id: string }) => {
    if (!walletAddress || !addToWatchlistMutation) return;
    await addToWatchlistMutation({ user_address: walletAddress, index_id });
  };

  const removeFromWatchlist = async ({ index_id }: { index_id: string }) => {
    if (!walletAddress || !removeFromWatchlistMutation) return;
    await removeFromWatchlistMutation({ user_address: walletAddress, index_id });
  };

  const isInWatchlist = ({ index_id }: { index_id: string }) => {
    if (!watchlist) return false;
    return watchlist.items.some((item: C_WatchlistWithEtf["items"][number]) => item.index_id === index_id);
  };

  const reorderWatchlist = async ({ index_id, new_index }: { index_id: string; new_index: number }) => {
    if (!walletAddress || !reorderWatchlistMutation) return;
    await reorderWatchlistMutation({ user_address: walletAddress, index_id, new_index });
  };

  return { addToWatchlist, removeFromWatchlist, isInWatchlist, watchlist, reorderWatchlist };
};
