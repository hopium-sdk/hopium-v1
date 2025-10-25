"use client";
import { Modal } from "@/main/components/ui/modal";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";
import { Icons } from "@/main/utils/icons";
import { Input } from "@/main/shadcn/components/ui/input";
import { LoadingButton } from "@/main/components/ui/loading-button";
import { useEffect, useState } from "react";
import { debounce } from "@tanstack/pacer";
import { cn } from "@/main/shadcn/lib/utils";
import { useHopiumContracts } from "@/main/hooks/use-hopium-contracts/use-hopium-contracts";
import { HOPIUM } from "@/main/lib/hopium";

export const CreateCouponModal = ({ modalOpen, setModalOpen }: { modalOpen: boolean; setModalOpen: (open: boolean) => void }) => {
  const [code, setCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { createCoupon } = useHopiumContracts({ setLoading });

  const checkIsValidCode = debounce(
    async () => {
      setValidationLoading(true);
      const isCodeTaken = await HOPIUM.fns.etfAffiliate.isCodeTaken({ code: code });
      setIsValidCode(!isCodeTaken);
      setValidationLoading(false);
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (code.length > 0) {
      checkIsValidCode();
    }
  }, [code]);

  const handleCreateCoupon = async () => {
    await createCoupon({ code: code });
    setModalOpen(false);
    setCode("");
    setIsValidCode(false);
    setValidationLoading(false);
  };

  return (
    <Modal title="Create Coupon" modalOpen={modalOpen} setModalOpen={setModalOpen} buttonVisible={false}>
      <div className="flex flex-1 flex-col justify-between overflow-hidden min-h-[300px]">
        <div className="">
          <p className="text-sm text-subtext font-medium">
            Create a new coupon to start earning. When this coupon is created on the blockchain, you can start sharing it with your friends and community.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-sm font-medium">Coupon code</p>
            <div className="flex items-center gap-2 bg-bg-900 rounded-base px-4 py-2">
              <Input
                placeholder="Enter your coupon code (eg. CRYPTO)"
                className={cn(code.length > 0 ? "uppercase" : "")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            {code.length > 0 ? (
              validationLoading ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <Icons.Loading className="size-4 animate-spin" />
                  <p className="text-sm font-medium">Checking coupon...</p>
                </div>
              ) : isValidCode ? (
                <div className="flex items-center gap-2 text-buy">
                  <Icons.CheckCircle className="size-4" />
                  <p className="text-sm font-medium">Coupon code is valid</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sell">
                  <Icons.Info className="size-4" />
                  <p className="text-sm font-medium">Coupon code is invalid</p>
                </div>
              )
            ) : null}
          </div>
        </div>
        <LoadingButton loading={loading} onClick={handleCreateCoupon}>
          <SubscriptDiv baseItem={<Icons.Coupon className="size-4" />} subscriptItem={<p className="text-sm font-medium">+</p>} />
          Create Coupon
        </LoadingButton>
      </div>
    </Modal>
  );
};
