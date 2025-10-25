"use client";
import { CONVEX } from "@/main/lib/convex";
import { Icons } from "@/main/utils/icons";
import { useQuery } from "convex/react";
import { useAccount } from "wagmi";
import { getCreatedCouponsColumns } from "./components/columns";
import { RealtimeTable } from "@/main/components/ui/table";
import { Suspense, useState } from "react";
import { Button } from "@/main/shadcn/components/ui/button";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";
import { CreateCouponModal } from "./modals/create-coupon-modal";
import { ShareCouponModal } from "./modals/share-coupon-modal";

export const CreatedCoupons = () => {
  const [createCouponModalOpen, setCreateCouponModalOpen] = useState(false);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const { address } = useAccount();

  const results = useQuery(CONVEX.api.fns.affiliate.getAllCouponsByOwner.default, address ? { owner: address } : "skip");

  const columns = getCreatedCouponsColumns({ setShareLinkModalOpen, setShareCode });

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden bg-bg">
        <div className="flex items-center justify-between px-6 h-10 border-b-2">
          <div className="flex items-center gap-2">
            <Icons.Coupon className="size-4" />
            <p className="text-sm font-medium">Created Coupons</p>
          </div>
          <Button variant="default" size="sm" onClick={() => setCreateCouponModalOpen(true)}>
            <SubscriptDiv baseItem={<Icons.Coupon className="size-4" />} subscriptItem={<p className="text-sm font-medium">+</p>} />
            <p className="text-sm font-medium">Create</p>
          </Button>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <RealtimeTable queryMode="query" columns={columns} queryData={results} empty={{ containerLabelVariant: "affiliateCreatedCodes" }} />
        </div>
      </div>
      <Suspense>
        <CreateCouponModal modalOpen={createCouponModalOpen} setModalOpen={setCreateCouponModalOpen} />
      </Suspense>
      <Suspense>
        <ShareCouponModal modalOpen={shareLinkModalOpen} setModalOpen={setShareLinkModalOpen} shareCode={shareCode} />
      </Suspense>
    </>
  );
};
