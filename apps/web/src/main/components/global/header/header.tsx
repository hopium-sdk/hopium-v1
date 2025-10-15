"use client";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";
import { Search } from "@/main/components/global/search/search";
import { Icons } from "@/main/utils/icons";
import { cn } from "@/main/shadcn/lib/utils";
import { useBalanceEth } from "@/main/wrappers/components/balance-provider";
import { useAccount } from "wagmi";

export const Header = () => {
  const { address } = useAccount();

  return (
    <div className="h-14 border-b flex items-center justify-between px-6">
      <div className="w-full flex items-center">
        <Search />
      </div>
      <div className="flex items-center justify-end gap-4">
        <Rewards />
        <p className="text-border">|</p>
        {address && (
          <>
            <Balance />
            <p className="text-border">|</p>
          </>
        )}
        <ConnectWalletButton />
      </div>
    </div>
  );
};

const Balance = () => {
  const { balanceEth } = useBalanceEth();
  return (
    <div className={cn("w-fit flex items-center gap-1.5 cursor-pointer hover:bg-bg-900 rounded-md px-4 h-10")}>
      <div className="flex items-center justify-center">
        <Icons.Ether className="size-4" />
      </div>
      <p className="text-xs font-medium whitespace-nowrap">{balanceEth.toFixed(4)} ETH</p>
    </div>
  );
};

const Rewards = () => {
  return (
    <div className={cn("w-fit flex items-center gap-1.5 cursor-pointer hover:bg-main-900 rounded-md px-4 h-8 border border-main text-main")}>
      <div className="flex items-center justify-center">
        <Icons.Rewards className="size-4" />
      </div>
      <p className="text-xs font-medium whitespace-nowrap">12,454.43</p>
    </div>
  );
};
