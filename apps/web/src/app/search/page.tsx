import { Suspense } from "react";
import { EtfsList } from "@/main/components/views/etfs-list/etfs-list";

export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  return (
    <Suspense>
      <ServerPage searchParams={searchParams} />
    </Suspense>
  );
}

const ServerPage = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
  const { query } = await searchParams;
  return <EtfsList type="search" query={query ?? ""} />;
};
