import { T_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfMetadata } from "./components/metadata";
import { EtfChart } from "./components/chart";

export const EtfTop = ({ etf }: { etf: T_EtfWithAssetsAndPools }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EtfMetadata etf={etf} />
      <div className="flex-1 flex flex-col overflow-hidden">{etf.assets && <EtfChart etf={etf} />}</div>
    </div>
  );
};
