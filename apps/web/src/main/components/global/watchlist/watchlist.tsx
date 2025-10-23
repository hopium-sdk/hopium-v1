"use client";
import { useEffect, useState } from "react";
import { Icons } from "@/main/utils/icons";
import { cn } from "@/main/shadcn/lib/utils";
import { useWatchlist } from "@/main/hooks/use-watchlist";
import { NumberDiv } from "@/main/components/ui/number-div";
import { useRouter } from "next/navigation";
import { C_WatchlistWithEtf } from "@repo/convex/schema";
import { ReorderList, ReorderListItem } from "@/main/components/ui/reorder-list";
import { EtfImage } from "../../ui/etf-image";

type T_Watchlist = {
  collapsed: {
    isCollapsed: boolean;
    default: boolean;
  };
  setCollapsed: (collapsed: { isCollapsed: boolean; default: boolean }) => void;
};

export const Watchlist = ({ collapsed, setCollapsed }: T_Watchlist) => {
  const { watchlist } = useWatchlist();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (watchlist && watchlist.items.length > 0) {
      if (collapsed.default) {
        setCollapsed({ isCollapsed: false, default: true });
      }
    }
  }, [watchlist]);

  const handleCollapseClick = () => {
    setCollapsed({ isCollapsed: !collapsed.isCollapsed, default: false });
  };

  return (
    <div className="w-full flex flex-1 flex-col overflow-hidden">
      <div className={cn("flex items-center justify-between py-3 px-4", collapsed.isCollapsed ? "" : "border-b-2")}>
        <div className="flex items-center gap-1.5">
          <Icons.Watchlist className="size-4.5" />
          <p className="text-sm font-medium">Watchlist</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-subtext hover:text-text cursor-pointer" onClick={() => setEditMode(!editMode)}>
            {!collapsed.isCollapsed && <Icons.Edit className="size-4" />}
          </div>
          <div className="flex items-center justify-center text-subtext hover:text-text cursor-pointer" onClick={handleCollapseClick}>
            {collapsed.isCollapsed ? <Icons.ChevronUp className="size-4.5" /> : <Icons.Minus className="size-3.5" />}
          </div>
        </div>
      </div>
      {!collapsed.isCollapsed && (
        <div className="w-full flex flex-col flex-1 overflow-y-auto">
          {!watchlist || watchlist.items.length === 0 ? (
            <div className="w-full px-4 py-4">
              <p className="text-subtext text-xs">Add coins to your watchlist to keep track of them.</p>
            </div>
          ) : (
            <WatchlistContent watchlist={watchlist} editMode={editMode} />
          )}
        </div>
      )}
    </div>
  );
};

const WatchlistContent = ({ watchlist, editMode }: { watchlist: C_WatchlistWithEtf; editMode: boolean }) => {
  const { reorderWatchlist, removeFromWatchlist } = useWatchlist();
  const [items, setItems] = useState(watchlist ? watchlist.items : []);

  useEffect(() => {
    setItems(watchlist ? watchlist.items : []);
  }, [watchlist]);

  const handleReorder = async ({ id, index }: { id: string; index: number }) => {
    await reorderWatchlist({ etfId: Number(id), newIndex: index });
  };

  return (
    <ReorderList items={items} setItems={setItems} handleReorder={handleReorder} id_key="etfId">
      <div className="flex flex-col">
        {items.map((item) => (
          <WatchlistItem key={item.etfId} item={item} editMode={editMode} removeFromWatchlist={removeFromWatchlist} />
        ))}
      </div>
    </ReorderList>
  );
};

type T_WatchlistItem = {
  item: C_WatchlistWithEtf["items"][number];
  editMode: boolean;
  removeFromWatchlist: ({ etfId }: { etfId: number }) => Promise<void>;
};

const WatchlistItem = ({ item, editMode, removeFromWatchlist }: T_WatchlistItem) => {
  const [removeLoading, setRemoveLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!editMode) {
      router.push(`/etf/${item.etfId}`);
    }
  };

  const handleRemove = async () => {
    if (removeLoading) return;

    setRemoveLoading(true);
    await removeFromWatchlist({ etfId: item.etfId });
    setRemoveLoading(false);
  };

  const renderItem = () => {
    return (
      <div className={cn("w-full flex flex-col px-3 py-2 border-b-2 hover:bg-bg-900", editMode ? "" : "cursor-pointer")} onClick={handleClick}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {editMode && (
              <div className="size-4 flex items-center justify-center text-subtext hover:text-text cursor-move">
                <Icons.DragHandle className="size-4" />
              </div>
            )}
            <div className="size-8">
              <EtfImage address={item.etf.contracts.etfTokenAddress} withBox boxClassName="size-9" iconClassName="size-6" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium uppercase">{item.etf.details.ticker}</p>
              <p className="text-sm font-medium text-subtext">{item.etf.details.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!editMode && (
              <div className="flex flex-col items-end gap-0.25">
                <div className="flex items-center gap-1">
                  <NumberDiv symbolType={"usd"} number={item.etf.stats.price.usd} pClassName={cn("text-sm")} />
                </div>

                {/* <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-2xs",
                      Number(getChangePercent()) === 0 ? "text-subtext" : Number(getChangePercent()) > 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {getChangePercent()}%
                  </p>
                </div> */}
              </div>
            )}
            {editMode && (
              <div className="size-4 flex items-center justify-center text-subtext hover:text-text cursor-pointer" onClick={handleRemove}>
                {removeLoading ? <Icons.Loading className="size-4 animate-spin" /> : <Icons.Trash className="size-4" />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (editMode) {
    return (
      <ReorderListItem item={item} id_key="etfId">
        {renderItem()}
      </ReorderListItem>
    );
  }

  return <>{renderItem()}</>;
};
