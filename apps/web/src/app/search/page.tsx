import { Suspense } from "react";
import { SearchList } from "@/main/components/views/search-list/search-list";

export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  return (
    <Suspense>
      <ServerPage searchParams={searchParams} />
    </Suspense>
  );
}

const ServerPage = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
  const { query } = await searchParams;
  return <SearchList query={query ?? ""} />;
};
