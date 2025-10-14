import { cn } from "@/main/shadcn/lib/utils";

type T_SubscriptDiv = {
  baseItem: React.ReactNode;
  subscriptItem: React.ReactNode;
  boxClassName?: string;
  subscriptClassName?: string;
};

export const SubscriptDiv = ({ baseItem, subscriptItem, boxClassName, subscriptClassName }: T_SubscriptDiv) => {
  return (
    <div className={cn("relative w-4 h-4 flex items-center justify-center", boxClassName)}>
      {baseItem}
      {subscriptItem && (
        <div className={cn("absolute -top-2.5 -right-2 w-4 h-4 flex items-center justify-center rounded-full", subscriptClassName)}>{subscriptItem}</div>
      )}
    </div>
  );
};
