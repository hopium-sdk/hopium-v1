"use client";
import Image from "next/image";
import { cn } from "@/main/shadcn/lib/utils";
import { useState } from "react";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { normalizeAddress } from "@repo/common/utils/address";
import { AvatarImage } from "./avatar";

interface CoinImageProps {
  address: string;
  boxClassName?: string;
}

export const CoinImage = ({ address, boxClassName }: CoinImageProps) => {
  const [error, setError] = useState(false);

  const chain = COMMON_CONSTANTS.networkSelected;

  return (
    <>
      <div style={{ containerType: "inline-size" }} className={cn("w-full h-full overflow-hidden rounded-base", boxClassName, error && "hidden")}>
        <Image
          src={`${COMMON_CONSTANTS.storage_url}/token_images/${chain}/${normalizeAddress(address)}.png`}
          alt={address}
          width={250}
          height={250}
          className={cn("object-cover rounded-full")}
          onError={() => setError(true)}
        />
      </div>
      <AvatarImage address={address} boxClassName={cn(boxClassName, !error && "hidden")} iconVariant="coin" withBox />
    </>
  );
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const CoinImageWithUrl = ({ imageUrl, boxClassName }: { imageUrl: string; boxClassName?: string }) => {
  const [error, setError] = useState(imageUrl === "" || imageUrl === null || imageUrl === undefined);

  return (
    <>
      {imageUrl && (
        <div style={{ containerType: "inline-size" }} className={cn("w-full h-full overflow-hidden rounded-base", boxClassName, error && "hidden")}>
          <Image src={imageUrl} alt="coin" width={250} height={250} className={cn("object-cover rounded-full")} onError={() => setError(true)} />
        </div>
      )}

      <AvatarImage address={ZERO_ADDRESS} boxClassName={cn(boxClassName, !error && "hidden")} iconVariant="coin" withBox />
    </>
  );
};
