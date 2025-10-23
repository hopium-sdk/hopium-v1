import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/main/shadcn/components/ui/resizable";
import { useLocalStorage } from "@/main/hooks/use-local-storage";
import z from "zod";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { EtfBottom } from "./components/bottom/bottom";
import { EtfTop } from "./components/top/top";

export const EtfMain = ({ etf, showMetadata = true }: { etf: C_EtfWithAssetsAndPools; showMetadata?: boolean }) => {
  const [etfBottomCollapsed, setEtfBottomCollapsed] = useLocalStorage({ key: "etfBottomCollapsed", schema: z.boolean(), initialValue: false });

  return (
    <>
      {!etfBottomCollapsed ? (
        <ResizablePanelGroup direction="vertical" className="w-full h-full flex flex-col overflow-hidden" autoSaveId="coin-chart">
          <ResizablePanel defaultSize={70} className="min-h-[300px]">
            <div className="w-full h-full flex flex-col overflow-hidden lg:rounded-box bg-bg">
              <EtfTop etf={etf} showMetadata={showMetadata} />
            </div>
          </ResizablePanel>
          <ResizableHandle className="pt-box" />
          <ResizablePanel defaultSize={30} className="min-h-[150px]">
            <div className="w-full h-full flex flex-col overflow-hidden lg:rounded-box bg-bg">
              <EtfBottom etf={etf} etfBottomCollapsed={etfBottomCollapsed} setEtfBottomCollapsed={setEtfBottomCollapsed} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-1 flex-col gap-box overflow-hidden">
          <div className="w-full flex flex-1 flex-col overflow-hidden lg:rounded-box bg-bg">
            <EtfTop etf={etf} showMetadata={showMetadata} />
          </div>
          <div className="w-full flex flex-col overflow-hidden lg:rounded-box bg-bg">
            <EtfBottom etf={etf} etfBottomCollapsed={etfBottomCollapsed} setEtfBottomCollapsed={setEtfBottomCollapsed} />
          </div>
        </div>
      )}
    </>
  );
};
