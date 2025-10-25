import { HOPIUM } from "@/main/lib/hopium";
import { Chain } from "viem";
import { useWriteContract } from "wagmi";
import { TOAST } from "@/main/components/ui/toast/toast";

type T_CreateCouponFn = {
  code: string;
  setLoading: (loading: string | null) => void;
  address: `0x${string}` | undefined;
  chain: Chain | undefined;
  writeContractAsync: ReturnType<typeof useWriteContract>["writeContractAsync"];
};

export const _createCouponFn = async ({ code, setLoading, address, chain, writeContractAsync }: T_CreateCouponFn) => {
  const etfAffiliateAddress = await HOPIUM.contracts.addresses.etfAffiliate();

  setLoading("Confirm tx...");
  const hash: `0x${string}` = await writeContractAsync({
    abi: HOPIUM.contracts.abis.etfAffiliate,
    address: etfAffiliateAddress,
    functionName: "createAffiliate",
    args: [code, address as `0x${string}`],
    chain,
    account: address,
  });

  return hash;
};

export const _createCouponToastFn = ({ code }: { code: string }) => {
  TOAST.showSuccessToast({
    title: "Coupon created successfully",
    description: `You successfully created coupon : ${code}`,
  });
};
