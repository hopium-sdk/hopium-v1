import { LoadingDiv } from "@/main/components/ui/loading-div";
import { EtfsList } from "@/main/components/views/etfs-list/etfs-list";
import { EtfListOptions } from "@repo/convex/schema";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ sortOption: string }> }) {
  return (
    <Suspense fallback={<LoadingDiv />}>
      <ServerPage params={params} />
    </Suspense>
  );
}

const ServerPage = async ({ params }: { params: Promise<{ sortOption: string }> }) => {
  const { sortOption } = await params;

  if (!EtfListOptions.includes(sortOption as (typeof EtfListOptions)[number])) {
    return notFound();
  }

  return <EtfsList type="list" query={sortOption as (typeof EtfListOptions)[number]} />;
};
