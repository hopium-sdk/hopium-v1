import { useState } from "react";
import { Icons } from "@/main/utils/icons";
import { Tabs, TabsList, TabsTrigger } from "@/main/shadcn/components/ui/tabs";
import { cn } from "@/main/shadcn/lib/utils";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfMetadata } from "../components/main/components/top/components/metadata";
import { EtfMain } from "../components/main/main";
import { EtfSidebar } from "../components/sidebar/sidebar";

const tabOptions = [
  {
    label: "Details",
    icon: <Icons.Details2 className="size-5" />,
  },
  {
    label: "Trade",
    icon: <Icons.Trade className="size-5" />,
  },
];

export const EtfMobile = ({ etfWithAssetsAndPools }: { etfWithAssetsAndPools: C_EtfWithAssetsAndPools }) => {
  const [tabSelected, setTabSelected] = useState<(typeof tabOptions)[number]["label"]>("Details");

  return (
    <div className="flex lg:hidden flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden bg-bg">
        <EtfMetadata etf={etfWithAssetsAndPools} />
        <div className="flex flex-1 flex-col overflow-hidden">
          {tabSelected === "Details" && <EtfMain etf={etfWithAssetsAndPools} showMetadata={false} />}
          {tabSelected === "Trade" && <EtfSidebar etf={etfWithAssetsAndPools} />}
        </div>
      </div>
      <TabsBar tabSelected={tabSelected} setTabSelected={setTabSelected} />
    </div>
  );
};

type T_TabsBar = {
  tabSelected: (typeof tabOptions)[number]["label"];
  setTabSelected: (tab: (typeof tabOptions)[number]["label"]) => void;
};

const TabsBar = ({ tabSelected, setTabSelected }: T_TabsBar) => {
  const handleTabChange = (value: (typeof tabOptions)[number]["label"]) => {
    setTabSelected(value);
  };

  return (
    <div className="flex w-full h-fit items-center justify-between gap-2 px-4 py-1 border-t-2 bg-bg">
      <Tabs value={tabSelected} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-bg gap-1">
          {tabOptions.map((option, index) => (
            <TabsTrigger
              key={index}
              value={option.label}
              className={cn("px-5 rounded-base py-1 w-full flex flex-col gap-1 data-[state=active]:bg-bg data-[state=active]:text-text")}
            >
              {option.icon}
              <p className={cn("text-xs")}>{option.label}</p>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
