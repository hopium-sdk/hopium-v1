"use client";
import { EtfSidebar } from "./components/sidebar/sidebar";
import { EtfMain } from "./components/main/main";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { LoadingDiv } from "../../ui/loading-div";
import { notFound } from "next/navigation";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { Icons } from "@/main/utils/icons";
import { Tabs, TabsList, TabsTrigger } from "@/main/shadcn/components/ui/tabs";
import { cn } from "@/main/shadcn/lib/utils";
import { useState } from "react";
import { EtfMetadata } from "./components/main/components/top/components/metadata";

export const Etf = ({ etfId }: { etfId: number }) => {
  const etfWithAssetsAndPools = useQuery(CONVEX.api.fns.etf.getEtfWithAssetsAndPools.default, {
    etfId,
  });

  if (etfWithAssetsAndPools === null) {
    return notFound();
  }

  if (etfWithAssetsAndPools === undefined) {
    return <LoadingDiv />;
  }

  return (
    <>
      <EtfMobile etfWithAssetsAndPools={etfWithAssetsAndPools} />
      <EtfDesktop etfWithAssetsAndPools={etfWithAssetsAndPools} />
    </>
  );
};

const EtfMobile = ({ etfWithAssetsAndPools }: { etfWithAssetsAndPools: C_EtfWithAssetsAndPools }) => {
  const [tabSelected, setTabSelected] = useState<(typeof tabOptions)[number]["label"]>("Details");

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

  const TabsBar = () => {
    const handleTabChange = (value: string) => {
      setTabSelected(value);
    };

    return (
      <div className="flex w-full h-fit items-center justify-between gap-2 px-4 py-1 border-t bg-bg">
        <Tabs value={tabSelected} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full border-0 gap-1">
            {tabOptions.map((option, index) => (
              <TabsTrigger
                key={index}
                value={option.label}
                className={cn("px-5 rounded-box py-1 w-full flex flex-col gap-1 data-[state=active]:bg-bg data-[state=active]:text-main")}
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
  return (
    <div className="flex lg:hidden flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden bg-bg">
        <EtfMetadata etf={etfWithAssetsAndPools} />
        <div className="flex flex-1 flex-col overflow-hidden">
          {tabSelected === "Details" && <EtfMain etf={etfWithAssetsAndPools} showMetadata={false} />}
          {tabSelected === "Trade" && <EtfSidebar etf={etfWithAssetsAndPools} />}
        </div>
      </div>
      <TabsBar />
    </div>
  );
};

const EtfDesktop = ({ etfWithAssetsAndPools }: { etfWithAssetsAndPools: C_EtfWithAssetsAndPools }) => {
  return (
    <div className="flex-1 overflow-hidden hidden lg:flex gap-box">
      <div className="flex flex-1 flex-col overflow-hidden">
        <EtfMain etf={etfWithAssetsAndPools} />
      </div>
      <div className="flex w-[350px] flex-col overflow-hidden rounded-box">
        <EtfSidebar etf={etfWithAssetsAndPools} />
      </div>
    </div>
  );
};
