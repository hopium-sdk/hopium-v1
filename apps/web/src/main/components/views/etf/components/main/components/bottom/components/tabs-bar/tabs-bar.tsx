import { cn } from "@/main/shadcn/lib/utils";
import { etfTabOptions, T_Tab_Option } from "./tabs-options";
import { Tabs, TabsList, TabsTrigger } from "@/main/shadcn/components/ui/tabs";
import { Icons } from "@/main/utils/icons";

type T_EtfTabsBar = {
  tabSelected: T_Tab_Option;
  setTabSelected: (tab: T_Tab_Option) => void;
  etfBottomCollapsed: boolean;
  setEtfBottomCollapsed: (etfBottomCollapsed: boolean) => void;
};

export const EtfTabsBar = ({ tabSelected, setTabSelected, etfBottomCollapsed, setEtfBottomCollapsed }: T_EtfTabsBar) => {
  const handleTabChange = (value: string) => {
    if (etfBottomCollapsed) {
      setEtfBottomCollapsed(false);
      setTabSelected(value as T_Tab_Option);
    } else {
      setTabSelected(value as T_Tab_Option);
    }
  };

  return (
    <div className={cn("flex w-full items-center justify-between gap-2 px-4 py-1", etfBottomCollapsed ? "" : "border-b")}>
      <Tabs value={tabSelected} onValueChange={handleTabChange}>
        <TabsList className="w-full border-0 gap-2">
          {etfTabOptions.map((option, index) => (
            <TabsTrigger
              key={index}
              value={option.label}
              className={cn(
                "px-5 rounded-md py-1.5",
                etfBottomCollapsed ? "dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-subtext" : ""
              )}
            >
              <option.icon />
              <span className={cn("text-xs")}>{option.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2">
        <div
          className="size-4 flex items-center justify-center text-subtext hover:text-text cursor-pointer"
          onClick={() => setEtfBottomCollapsed(!etfBottomCollapsed)}
        >
          {etfBottomCollapsed ? <Icons.ChevronUp className="size-4" /> : <Icons.Minus className="size-3.5" />}
        </div>
      </div>
    </div>
  );
};
