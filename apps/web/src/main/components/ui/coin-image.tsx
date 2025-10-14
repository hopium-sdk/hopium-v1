"use client";
import Image from "next/image";
import { cn } from "@/main/shadcn/lib/utils";
import { useState } from "react";

interface CoinImageProps {
  address: string;
  boxClassName?: string;
}

export const CoinImage = ({ address, boxClassName }: CoinImageProps) => {
  const [error, setError] = useState(false);

  return (
    <div style={{ containerType: "inline-size" }} className={cn("w-full h-full overflow-hidden rounded-md", boxClassName)}>
      <Image
        src={"https://token-icons.s3.amazonaws.com/eth.png"}
        alt={address}
        width={250}
        height={250}
        className={cn("object-cover", error && "hidden")}
        onError={() => setError(true)}
      />
    </div>
  );
};
