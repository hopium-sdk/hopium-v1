"use client";
import { useIsMobile } from "@/main/hooks/use-is-mobile";
import { useAccount } from "wagmi";
import { LoadingDiv } from "../../ui/loading-div";
import { EmptyContainer } from "../../ui/empty-container";
import { useEffect, useState } from "react";
import { HOPIUM } from "@/main/lib/hopium";
import { ConnectWalletPrompt } from "../../global/connect-wallet-prompt/connect-wallet-prompt";
import { AdminMain } from "./components/main/main";
import { AdminSidebar } from "./components/sidebar/sidebar";

export const Admin = () => {
  const { isRawMobile } = useIsMobile();
  const { address } = useAccount();
  const [owner, setOwner] = useState<`0x${string}` | undefined>(undefined);

  useEffect(() => {
    const fetchOwner = async () => {
      const owner = await HOPIUM.fns.directory.getOwner();
      setOwner(owner);
    };
    fetchOwner();
  }, []);

  if (isRawMobile === undefined || owner === undefined) {
    return <LoadingDiv />;
  }

  if (isRawMobile) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden gap-box bg-bg">
        <EmptyContainer labelVariant="mobileNotSupported" showSubtext />
      </div>
    );
  }

  if (!address) {
    return <ConnectWalletPrompt />;
  }

  if (owner !== address) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden gap-box bg-bg">
        <EmptyContainer labelVariant="unauthorized" showSubtext={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden gap-box">
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminMain />
      </div>
      <div className="flex w-[400px] flex-col overflow-hidden">
        <AdminSidebar />
      </div>
    </div>
  );
};
