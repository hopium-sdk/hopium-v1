"use client";
import { LoadingDiv } from "@/main/components/ui/loading-div";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCoupon } from "@/main/hooks/use-coupon";

export const A = ({ coupon }: { coupon: string }) => {
  const { savedCoupon, setSavedCoupon } = useCoupon();
  const router = useRouter();

  useEffect(() => {
    if (savedCoupon !== coupon) {
      setSavedCoupon(coupon);
    } else {
      router.push("/");
    }
  }, [savedCoupon, coupon]);

  return <LoadingDiv />;
};
