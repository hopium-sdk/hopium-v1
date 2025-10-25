import { AdminTabsBar, T_Tab_Option } from "./components/tabs-bar/tabs-bar";
import { useState } from "react";
import { AdminFeeTransfers } from "./components/tabs/fee-transfers/fee-transfers";

export const AdminMain = () => {
  const [tabSelected, setTabSelected] = useState<T_Tab_Option>("Fee Transfers");

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-bg">
      <AdminTabsBar tabSelected={tabSelected} setTabSelected={setTabSelected} />

      {tabSelected === "Fee Transfers" && <AdminFeeTransfers />}
    </div>
  );
};
