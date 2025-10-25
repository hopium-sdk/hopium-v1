"use client";
import { useState } from "react";
import { Icons } from "@/main/utils/icons";
import { Tabs, TabsTrigger, TabsList } from "@/main/shadcn/components/ui/tabs";
import { cn } from "@/main/shadcn/lib/utils";
import { AffiliateSidebar } from "../sidebar/sidebar";
import { useAccount } from "wagmi";
import { ConnectWalletPrompt } from "@/main/components/global/connect-wallet-prompt/connect-wallet-prompt";
import { AffiliateHeader } from "../main/components/header";
import { CreatedCoupons } from "../main/components/created-coupons/created-coupons";
import { AffiliateActivity } from "../main/components/activity/activity";

export const AffiliateMobile = () => {
  const { address } = useAccount();
  const [tabSelected, setTabSelected] = useState<string>("Overview");

  return (
    <div className="flex lg:hidden flex-1 flex-col justify-between overflow-hidden flex gap-box bg-bg">
      {tabSelected === "Overview" ? (
        <AffiliateSidebar />
      ) : address ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="w-full border-b-2">
            <AffiliateHeader />
          </div>
          {tabSelected === "Created" && <CreatedCoupons />}
          {tabSelected === "Activity" && <AffiliateActivity />}
        </div>
      ) : (
        <ConnectWalletPrompt alwaysFullWidthButton={true} />
      )}

      <TabsBar tabSelected={tabSelected} setTabSelected={setTabSelected} />
    </div>
  );
};

const TabsBar = ({ tabSelected, setTabSelected }: { tabSelected: string; setTabSelected: (tab: string) => void }) => {
  const tabOptions = [
    {
      label: "Overview",
      icon: <Icons.Overview className="size-4" />,
    },
    {
      label: "Created",
      icon: <Icons.Coupon className="size-4" />,
    },
    {
      label: "Activity",
      icon: <Icons.Activity className="size-4" />,
    },
  ];

  const handleTabChange = (value: string) => {
    setTabSelected(value);
  };

  return (
    <div className="flex w-full h-fit items-center justify-between gap-2 px-4 py-1 border-t-2 bg-bg">
      <Tabs value={tabSelected} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-bg gap-1">
          {tabOptions.map((option, index) => (
            <TabsTrigger
              key={index}
              value={option.label}
              className={cn("px-5 rounded-base py-1 w-full flex flex-col gap-1 data-[state=active]:bg-bg data-[state=active]:text-text")}
            >
              {option.icon}
              <p className={cn("text-xs")}>{option.label}</p>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
