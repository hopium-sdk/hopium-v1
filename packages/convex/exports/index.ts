import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export const ConvexSdk = {
  api: api,
  httpClient: (convexUrl: string) => new ConvexHttpClient(convexUrl),
};
