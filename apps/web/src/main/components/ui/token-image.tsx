"use client";
import { useState } from "react";
import { cn } from "@/main/shadcn/lib/utils";
import { getStaticColor } from "@/main/components/ui/avatar";
import { Icons } from "@/main/utils/icons";
import Image from "next/image";

type T_TokenImage = {
  address: string;
  imageUrl: string;
  className?: string;
  iconClassName?: string;
};

export const TokenImage = ({ address, imageUrl, className, iconClassName }: T_TokenImage) => {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn("w-10 h-10 rounded-full overflow-hidden flex items-center justify-center", error ? getStaticColor(address).bg950 : "bg-bg-800", className)}
    >
      {error ? (
        <Icons.Coin className={cn(getStaticColor(address).text, "size-8", iconClassName)} />
      ) : (
        <Image src={imageUrl} alt={address} width={40} height={40} onError={() => setError(true)} />
      )}
    </div>
  );
};
