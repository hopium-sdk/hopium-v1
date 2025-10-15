"use client";
import { EtfSidebar } from "./components/sidebar/sidebar";
import { EtfMain } from "./components/main/main";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { LoadingDiv } from "../../ui/loading-div";
import { notFound } from "next/navigation";

export const Etf = ({ indexId }: { indexId: string }) => {
  const etf = useQuery(CONVEX.api.fns.etf.getEtf.default, {
    indexId,
  });

  const underlyingTokens = useQuery(CONVEX.api.fns.etf.getEtfUnderlyingTokens.default, etf ? { indexId: etf.index.indexId } : "skip");

  if (etf === null) {
    return notFound();
  }

  if (etf === undefined) {
    return <LoadingDiv />;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <EtfMain etf={etf} underlyingTokens={underlyingTokens} />
      </div>
      <div className="flex w-[350px] flex-col overflow-hidden border-l">
        <EtfSidebar etf={etf} underlyingTokens={underlyingTokens} />
      </div>
    </div>
  );
};
