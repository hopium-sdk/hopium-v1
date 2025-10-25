"use client";
import { AffiliateHeader } from "./components/header";
import { CreatedCoupons } from "./components/created-coupons/created-coupons";
import { AffiliateActivity } from "./components/activity/activity";
import { useAccount } from "wagmi";
import { ConnectWalletPrompt } from "../../../global/connect-wallet-prompt/connect-wallet-prompt";

export const AffiliateMain = () => {
  const { address } = useAccount();

  if (!address) {
    return <ConnectWalletPrompt />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden gap-box">
      <AffiliateHeader />
      <div className="flex flex-1 flex-col xl:flex-row overflow-hidden gap-box">
        <div className="w-full xl:w-1/2 h-1/2 xl:h-full flex flex-col overflow-hidden">
          <CreatedCoupons />
        </div>
        <div className="w-full xl:w-1/2 h-1/2 xl:h-full flex flex-col overflow-hidden">
          <AffiliateActivity />
        </div>
      </div>
    </div>
  );
};
