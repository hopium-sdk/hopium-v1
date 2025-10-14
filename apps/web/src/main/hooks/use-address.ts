"use client";
import { isEthAddress, normalizeAddress } from "@repo/common/utils/address";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export const useAddress = () => {
  const pathname = usePathname();
  const pathnameArray = pathname.split("/");
  const { address } = useAccount();

  const profileParam = pathnameArray.length > 2 ? pathnameArray[2] : undefined;

  const profileAddress =
    pathnameArray.length > 2 && pathnameArray[1] === "profile" && profileParam !== undefined && isEthAddress(profileParam) ? profileParam : null;

  const walletAddress = address ? normalizeAddress(address as string) : null;

  return { profileAddress, walletAddress };
};
