import { C_Etf, T_HoldingToken } from "@repo/convex/schema";
import { EtfMetadata } from "./components/metadata";
import { EtfChart } from "./components/chart";

export const EtfTop = ({ etf, underlyingTokens }: { etf: C_Etf; underlyingTokens: T_HoldingToken[] }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EtfMetadata etf={etf} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EtfChart etf={etf} underlyingTokens={underlyingTokens} />
      </div>
    </div>
  );
};
