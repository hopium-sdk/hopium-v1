import { EtfTabsBar } from "./components/tabs-bar/tabs-bar";
import { T_Tab_Option } from "./components/tabs-bar/tabs-options";
import { T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfHolders } from "./components/tabs/holders/holders";
import { useState } from "react";
import { EtfPositions } from "./components/tabs/positions/positions";
import { EtfVault } from "./components/tabs/vault/vault";

type T_EtfBottom = {
  etf: T_EtfWithAssetsAndPools;
  etfBottomCollapsed: boolean;
  setEtfBottomCollapsed: (etfBottomCollapsed: boolean) => void;
};

export const EtfBottom = ({ etf, etfBottomCollapsed, setEtfBottomCollapsed }: T_EtfBottom) => {
  const [tabSelected, setTabSelected] = useState<T_Tab_Option>("Positions");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <EtfTabsBar
        tabSelected={tabSelected}
        setTabSelected={setTabSelected}
        etfBottomCollapsed={etfBottomCollapsed}
        setEtfBottomCollapsed={setEtfBottomCollapsed}
      />
      {!etfBottomCollapsed && (
        <>
          {tabSelected === "Positions" && <EtfPositions />}
          {tabSelected === "Holders" && <EtfHolders etf={etf} />}
          {tabSelected === "Vault" && <EtfVault etf={etf} />}
        </>
      )}
    </div>
  );
};
