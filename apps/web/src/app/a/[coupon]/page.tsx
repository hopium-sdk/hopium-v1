import { LoadingDiv } from "@/main/components/ui/loading-div";
import { A } from "@/main/components/views/affiliate/a";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ coupon: string }> }) {
  return (
    <Suspense fallback={<LoadingDiv />}>
      <ServerPage params={params} />
    </Suspense>
  );
}

const ServerPage = async ({ params }: { params: Promise<{ coupon: string }> }) => {
  const { coupon } = await params;

  return <A coupon={coupon} />;
};
