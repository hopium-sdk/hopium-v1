import { cn } from "@/main/shadcn/lib/utils";
import { Tabs, TabsTrigger, TabsList } from "@/main/shadcn/components/ui/tabs";

type T_ActionButtons = {
  actionSelected: string;
  setActionSelected: (action: string) => void;
};

export const ActionButtons = ({ actionSelected, setActionSelected }: T_ActionButtons) => {
  const css = {
    action_button_div: "py-1.25",
    action_button_p: "text-xs font-medium",
    buy_base: "data-[state=active]:bg-buy-900 dark:data-[state=active]:bg-buy-900 hover:dark:data-[state=inactive]:bg-bg-800",
    sell_base: "data-[state=active]:bg-sell-900 dark:data-[state=active]:bg-sell-900 hover:dark:data-[state=inactive]:bg-bg-800",
  };

  return (
    <Tabs value={actionSelected} onValueChange={(value) => setActionSelected(value)}>
      <TabsList className="w-full">
        <TabsTrigger value="Buy" className={cn(css.action_button_div, css.buy_base)}>
          <p className={cn(css.action_button_p)}>Buy</p>
        </TabsTrigger>
        <TabsTrigger value="Sell" className={cn(css.action_button_div, css.sell_base)}>
          <p className={cn(css.action_button_p)}>Sell</p>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
