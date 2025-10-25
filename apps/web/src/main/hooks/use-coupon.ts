import { z } from "zod";
import { useLocalStorage } from "./use-local-storage";

export const useCoupon = () => {
  const [savedCoupon, setSavedCoupon] = useLocalStorage({ key: "affiliate-coupon", schema: z.string(), initialValue: "" });

  return { savedCoupon, setSavedCoupon };
};
