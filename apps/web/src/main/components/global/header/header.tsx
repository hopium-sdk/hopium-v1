"use client";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";
import { Search } from "@/main/components/global/search/search";

export const Header = () => {
  return (
    <div className="h-14 border-b flex items-center justify-between px-6">
      <div className="w-full flex items-center">
        <Search />
      </div>
      <div className="flex items-center justify-end gap-6">
        <ConnectWalletButton />
      </div>
    </div>
  );
};
