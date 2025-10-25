"use client";
import { AvatarImage } from "@/main/components/ui/avatar";
import { NumberDiv } from "@/main/components/ui/number-div";
import { formatAddress } from "@repo/common/utils/address";
import { useAccount } from "wagmi";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";

export const AffiliateHeader = () => {
  const { address } = useAccount();
  const totalEarnings = useQuery(CONVEX.api.fns.affiliate.getTotalEarnings.default, address ? { owner: address } : "skip");

  const options = ["Total Earnings"];

  const getOptionValue = (option: string) => {
    if (option === "Total Earnings") {
      return totalEarnings ?? 0;
    }
    return 0;
  };

  return (
    <div className="flex items-center justify-between overflow-hidden gap-2 bg-bg px-6 py-2">
      <div className="flex items-center gap-2">
        <AvatarImage address={address ?? ""} withBox boxClassName="size-10" iconClassName="size-6" />
        <p className="text-sm text-text font-medium">{formatAddress(address ?? "")}</p>
      </div>
      <div className="flex flex-1 items-center justify-end gap-10">
        {options.map((option) => (
          <div key={option} className="flex flex-col items-end justify-center">
            <p className="text-sm text-subtext font-medium">{option}</p>
            <NumberDiv
              number={getOptionValue(option)}
              symbolType={option === "Total Earnings" ? "eth" : undefined}
              pClassName="text-md font-medium"
              iconClassName="size-4.5"
              className="text-buy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
