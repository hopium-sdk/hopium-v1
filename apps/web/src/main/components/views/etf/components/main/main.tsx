import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/main/shadcn/components/ui/resizable";
import { useState } from "react";
import { useLocalStorage } from "@/main/hooks/use-local-storage";
import z from "zod";
import { C_Etf } from "@repo/convex/schema";
import { T_Tab_Option } from "./components/bottom/components/tabs-bar/tabs-options";
import { EtfBottom } from "./components/bottom/bottom";

export const EtfMain = ({ etf }: { etf: C_Etf }) => {
  const [tabSelected, setTabSelected] = useState<T_Tab_Option>("Positions");
  const [etfBottomCollapsed, setEtfBottomCollapsed] = useLocalStorage({ key: "etfBottomCollapsed", schema: z.boolean(), initialValue: false });

  return (
    <>
      {!etfBottomCollapsed ? (
        <ResizablePanelGroup direction="vertical" className="w-full h-full flex flex-col overflow-hidden gap-0.75" autoSaveId="coin-chart">
          <ResizablePanel defaultSize={60} className="min-h-[300px]">
            <div className="w-full h-full flex flex-col overflow-hidden">{/* <EtfTop etf={etf} /> */}</div>
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-transparent" />
          <ResizablePanel defaultSize={40} className="min-h-[150px]">
            <div className="w-full h-full flex flex-col overflow-hidden border-t">
              <EtfBottom
                etf={etf}
                etfBottomCollapsed={etfBottomCollapsed}
                setEtfBottomCollapsed={setEtfBottomCollapsed}
                tabSelected={tabSelected}
                setTabSelected={setTabSelected}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="w-full flex flex-1 flex-col overflow-hidden">{/* <EtfTop etf={etf} /> */}</div>
          <div className="w-full flex flex-col overflow-hidden border-t">
            <EtfBottom
              etf={etf}
              etfBottomCollapsed={etfBottomCollapsed}
              setEtfBottomCollapsed={setEtfBottomCollapsed}
              tabSelected={tabSelected}
              setTabSelected={setTabSelected}
            />
          </div>
        </div>
      )}
    </>
  );
};
