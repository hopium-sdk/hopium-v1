import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/main/shadcn/components/ui/resizable";
import { useState } from "react";
import { useLocalStorage } from "@/main/hooks/use-local-storage";
import z from "zod";
import { C_Etf, T_HoldingToken } from "@repo/convex/schema";
import { T_Tab_Option } from "./components/bottom/components/tabs-bar/tabs-options";
import { EtfBottom } from "./components/bottom/bottom";
import { EtfTop } from "./components/top/top";

export const EtfMain = ({ etf, underlyingTokens }: { etf: C_Etf; underlyingTokens: T_HoldingToken[] }) => {
  const [etfBottomCollapsed, setEtfBottomCollapsed] = useLocalStorage({ key: "etfBottomCollapsed", schema: z.boolean(), initialValue: false });

  return (
    <>
      {!etfBottomCollapsed ? (
        <ResizablePanelGroup direction="vertical" className="w-full h-full flex flex-col overflow-hidden" autoSaveId="coin-chart">
          <ResizablePanel defaultSize={70} className="min-h-[300px]">
            <div className="w-full h-full flex flex-col overflow-hidden">
              <EtfTop etf={etf} underlyingTokens={underlyingTokens} />
            </div>
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-transparent" />
          <ResizablePanel defaultSize={30} className="min-h-[150px]">
            <div className="w-full h-full flex flex-col overflow-hidden border-t">
              <EtfBottom etf={etf} etfBottomCollapsed={etfBottomCollapsed} setEtfBottomCollapsed={setEtfBottomCollapsed} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-1 flex-col gap-0 overflow-hidden">
          <div className="w-full flex flex-1 flex-col overflow-hidden">
            <EtfTop etf={etf} underlyingTokens={underlyingTokens} />
          </div>
          <div className="w-full flex flex-col overflow-hidden border-t">
            <EtfBottom etf={etf} etfBottomCollapsed={etfBottomCollapsed} setEtfBottomCollapsed={setEtfBottomCollapsed} />
          </div>
        </div>
      )}
    </>
  );
};
