import { Etf } from "@/main/components/views/etf/etf";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ indexId: string }> }) {
  return (
    <Suspense>
      <ServerPage params={params} />
    </Suspense>
  );
}

const ServerPage = async ({ params }: { params: Promise<{ indexId: string }> }) => {
  const { indexId } = await params;
  return <Etf indexId={indexId} />;
};
