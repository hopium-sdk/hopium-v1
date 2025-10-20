"use client";
import { Button } from "@/main/shadcn/components/ui/button";
import { PingCircle } from "@/main/components/ui/ping-circle";
import { Icons } from "@/main/utils/icons";
import { usePrices } from "@/main/wrappers/components/prices-provider";
import { numberToUsd } from "@repo/common/utils/currency";

export const Footer = () => {
  const { ethUsdPrice } = usePrices();
  return (
    <div className="h-10 border-t flex items-center px-6">
      <div className="">
        <div className="flex items-center gap-2.5">
          <PingCircle />
          <p className="text-xs">Live</p>
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 text-subtext">
          <Icons.Ether />
          <p className="text-xs font-medium">{numberToUsd(ethUsdPrice)}</p>
        </div>
        <p className="text-subtext pl-1">|</p>
        <Button variant="ghost" size="icon" className="text-subtext p-0">
          <Icons.Twitter />
        </Button>
      </div>
    </div>
  );
};
