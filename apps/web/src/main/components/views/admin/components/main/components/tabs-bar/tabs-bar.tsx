import { cn } from "@/main/shadcn/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/main/shadcn/components/ui/tabs";
import { Icons } from "@/main/utils/icons";

export type T_Tab_Option = "Fee Transfers";

export type T_Tab_Options = {
  label: T_Tab_Option;
  icon: React.ReactNode;
};

export const adminTabOptions: T_Tab_Options[] = [
  {
    label: "Fee Transfers",
    icon: <Icons.Ether />,
  },
];

type T_AdminTabsBar = {
  tabSelected: T_Tab_Option;
  setTabSelected: (tab: T_Tab_Option) => void;
};

export const AdminTabsBar = ({ tabSelected, setTabSelected }: T_AdminTabsBar) => {
  const handleTabChange = (value: string) => {
    setTabSelected(value as T_Tab_Option);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 px-6 py-1 border-b-2">
      <Tabs value={tabSelected} onValueChange={handleTabChange}>
        <TabsList className="w-full border-0 gap-1 bg-transparent">
          {adminTabOptions.map((option, index) => (
            <TabsTrigger key={index} value={option.label} className={cn("px-5 rounded-base h-7.5 data-[state=active]:bg-bg-900")}>
              {option.icon}
              <span className={cn("text-sm")}>{option.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
