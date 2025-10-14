"use client";
import { EtfSidebar } from "./components/sidebar/sidebar";
import { EtfMain } from "./components/main/main";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";

export const Etf = ({ indexId }: { indexId: string }) => {
  const etf = useQuery(CONVEX.api.fns.etf.getEtf.default, {
    indexId,
  });

  if (etf === null) {
    return <div>Etf not found</div>;
  }

  if (etf === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <EtfMain etf={etf} />
      </div>
      <div className="flex w-[350px] flex-col overflow-hidden border-l">
        <EtfSidebar etf={etf} />
      </div>
    </div>
  );
};
