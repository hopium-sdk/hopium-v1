import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/main/shadcn/components/ui/resizable";
import { useLocalStorage } from "@/main/hooks/use-local-storage";
import z from "zod";
import { C_Etf, C_Asset } from "@repo/convex/schema";
import { EtfBottom } from "./components/bottom/bottom";
import { EtfTop } from "./components/top/top";

export const EtfMain = ({ etf, assets }: { etf: C_Etf; assets: C_Asset[] }) => {
  const [etfBottomCollapsed, setEtfBottomCollapsed] = useLocalStorage({ key: "etfBottomCollapsed", schema: z.boolean(), initialValue: false });

  return (
    <>
      {!etfBottomCollapsed ? (
        <ResizablePanelGroup direction="vertical" className="w-full h-full flex flex-col overflow-hidden" autoSaveId="coin-chart">
          <ResizablePanel defaultSize={70} className="min-h-[300px]">
            <div className="w-full h-full flex flex-col overflow-hidden">
              <EtfTop etf={etf} assets={assets} />
            </div>
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-transparent" />
          <ResizablePanel defaultSize={30} className="min-h-[150px]">
            <div className="w-full h-full flex flex-col overflow-hidden border-t">
              <EtfBottom etf={etf} assets={assets} etfBottomCollapsed={etfBottomCollapsed} setEtfBottomCollapsed={setEtfBottomCollapsed} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-1 flex-col gap-0 overflow-hidden">
          <div className="w-full flex flex-1 flex-col overflow-hidden">
            <EtfTop etf={etf} assets={assets} />
          </div>
          <div className="w-full flex flex-col overflow-hidden border-t">
            <EtfBottom etf={etf} assets={assets} etfBottomCollapsed={etfBottomCollapsed} setEtfBottomCollapsed={setEtfBottomCollapsed} />
          </div>
        </div>
      )}
    </>
  );
};
