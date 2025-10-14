import { ConvexSdk } from "@repo/convex";

export const CONVEX = {
  api: ConvexSdk.api,
  httpClient: ConvexSdk.httpClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
};
