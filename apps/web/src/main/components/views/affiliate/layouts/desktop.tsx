import { AffiliateMain } from "../main/main";
import { AffiliateSidebar } from "../sidebar/sidebar";

export const AffiliateDesktop = () => {
  return (
    <div className="flex-1 overflow-hidden hidden lg:flex gap-box">
      <div className="flex flex-1 flex-col overflow-hidden">
        <AffiliateMain />
      </div>
      <div className="flex w-[400px] flex-col overflow-hidden rounded-box bg-bg">
        <AffiliateSidebar />
      </div>
    </div>
  );
};
