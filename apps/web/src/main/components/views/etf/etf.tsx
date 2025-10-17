"use client";
import { EtfSidebar } from "./components/sidebar/sidebar";
import { EtfMain } from "./components/main/main";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { LoadingDiv } from "../../ui/loading-div";
import { notFound } from "next/navigation";

export const Etf = ({ etfId }: { etfId: number }) => {
  const etfWithAssets = useQuery(CONVEX.api.fns.etf.getEtfWithAssets.default, {
    etfId,
  });

  if (etfWithAssets === null) {
    return notFound();
  }

  if (etfWithAssets === undefined) {
    return <LoadingDiv />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <EtfMain etf={etfWithAssets.etf} assets={etfWithAssets.assets} />
      </div>
      <div className="flex w-[350px] flex-col overflow-hidden border-l">
        <EtfSidebar etf={etfWithAssets.etf} assets={etfWithAssets.assets} />
      </div>
    </div>
  );
};
