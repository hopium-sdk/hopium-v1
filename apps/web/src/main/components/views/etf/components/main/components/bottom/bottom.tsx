import { EtfTabsBar } from "./components/tabs-bar/tabs-bar";
import { T_Tab_Option } from "./components/tabs-bar/tabs-options";
import { C_Etf } from "@repo/convex/schema";

type T_EtfBottom = {
  etf: C_Etf;
  etfBottomCollapsed: boolean;
  setEtfBottomCollapsed: (etfBottomCollapsed: boolean) => void;
  tabSelected: T_Tab_Option;
  setTabSelected: (tabSelected: T_Tab_Option) => void;
};

export const EtfBottom = ({ etf, etfBottomCollapsed, setEtfBottomCollapsed, tabSelected, setTabSelected }: T_EtfBottom) => {
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
          {/* {tabSelected === "Positions" && (CONSTANTS.env.isDev ? <CoinActivity coin={coin} /> : <CoinActivitySample coin={coin} />)}
          {tabSelected === "Holders" && (CONSTANTS.env.isDev ? <CoinBumpers coin={coin} /> : <CoinBumpersSample coin={coin} />)}
          {tabSelected === "Holders" && (CONSTANTS.env.isDev ? <CoinHolders coin={coin} /> : <CoinHolders coin={coin} />)} */}
        </>
      )}
    </div>
  );
};
