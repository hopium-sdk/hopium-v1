"use client";
import { useQuery } from "convex/react";
import { CONVEX } from "@/main/lib/convex";
import { LoadingDiv } from "../../ui/loading-div";
import { notFound } from "next/navigation";
import { LoadingLayout } from "../../ui/loading-layout";
import { EtfDesktop } from "./layouts/desktop";
import { EtfMobile } from "./layouts/mobile";

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
    <LoadingLayout
      desktop={<EtfDesktop etfWithAssetsAndPools={etfWithAssetsAndPools} />}
      mobile={<EtfMobile etfWithAssetsAndPools={etfWithAssetsAndPools} />}
    />
  );
};
