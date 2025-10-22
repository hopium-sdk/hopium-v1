import { Etf } from "@/main/components/views/etf/etf";
import { Suspense } from "react";
import { LoadingDiv } from "@/main/components/ui/loading-div";

export default async function Page({ params }: { params: Promise<{ etfId: string }> }) {
  return (
    <Suspense fallback={<LoadingDiv />}>
      <ServerPage params={params} />
    </Suspense>
  );
}

const ServerPage = async ({ params }: { params: Promise<{ etfId: string }> }) => {
  const { etfId } = await params;
  return <Etf etfId={Number(etfId)} />;
};
