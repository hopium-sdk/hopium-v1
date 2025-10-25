import { AffiliateDesktop } from "./layouts/desktop";
import { AffiliateMobile } from "./layouts/mobile";
import { LoadingLayout } from "../../ui/loading-layout";

export const Affiliate = () => {
  return <LoadingLayout desktop={<AffiliateDesktop />} mobile={<AffiliateMobile />} />;
};
