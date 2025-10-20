"use client";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";
import { Search } from "@/main/components/global/search/search";
import { Icons } from "@/main/utils/icons";
import { cn } from "@/main/shadcn/lib/utils";
import { useBalanceEth } from "@/main/wrappers/components/balance-provider";
import { useAccount } from "wagmi";
import { Suspense } from "react";

export const Header = () => {
  const { address } = useAccount();

  return (
    <div className="h-14 border-b flex items-center justify-between px-6">
      <div className="w-full flex items-center">
        <Suspense>
          <Search />
        </Suspense>
      </div>
      <div className="flex items-center justify-end gap-4">
        {address && (
          <>
            <Rewards />
            <p className="text-border">|</p>
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
    <div className={cn("w-fit flex items-center rounded-md h-8 border divide-x")}>
      <div className="flex items-center justify-center pl-3 pr-2">
        <Icons.Wallet className="size-4" />
      </div>
      <div className="flex items-center gap-0.75 pl-2 pr-3.5">
        <div className="flex items-center justify-center">
          <Icons.Ether className="size-3.75" />
        </div>
        <p className="text-xs font-medium">{balanceEth.toFixed(4)}</p>
      </div>
    </div>
  );
};

const Rewards = () => {
  return (
    <div className={cn("w-fit flex items-center gap-1.5 cursor-pointer bg-rewards-900 hover:opacity-80 rounded-md px-4 h-8 text-rewards")}>
      <div className="flex items-center justify-center">
        <Icons.Rewards className="size-4" />
      </div>
      <p className="text-xs font-medium whitespace-nowrap">12,454.43</p>
    </div>
  );
};
