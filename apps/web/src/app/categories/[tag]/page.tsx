import { LoadingDiv } from "@/main/components/ui/loading-div";
import { EtfsList } from "@/main/components/views/etfs-list/etfs-list";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
  return (
    <Suspense fallback={<LoadingDiv />}>
      <ServerPage params={params} />
    </Suspense>
  );
}

const ServerPage = async ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = await params;

  return <EtfsList type="tag" query={tag} />;
};
