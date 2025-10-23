"use client";
import { Button } from "@/main/shadcn/components/ui/button";
import { PingCircle } from "@/main/components/ui/ping-circle";
import { Icons } from "@/main/utils/icons";
import { usePrices } from "@/main/wrappers/components/prices-provider";
import { numberToUsd } from "@repo/common/utils/currency";
import { useSafeTheme } from "@/main/wrappers/components/theme-provider";
import { Tabs, TabsList, TabsTrigger } from "@/main/shadcn/components/ui/tabs";

export const Footer = () => {
  const { ethUsdPrice } = usePrices();
  return (
    <div className="h-10 border-t-0 flex items-center px-6 bg-bg">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2.5 bg-buy-900/70 rounded-full px-4 h-7.5">
          <PingCircle />
          <p className="text-sm font-medium text-green-500">Live</p>
        </div>
        <Button variant="bg900" size={"sm"}>
          <Icons.Ether />
          <p className="text-sm font-medium">{numberToUsd(ethUsdPrice)}</p>
          <Icons.ArrowUpRight className="size-3.5" />
        </Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <Button variant="bg900" size={"sm"}>
            <Icons.Twitter className="size-4" />
            <p className="text-sm">Twitter</p>
            <Icons.ArrowUpRight className="size-3.5" />
          </Button>
          <Button variant="bg900" size={"sm"}>
            <Icons.Discord className="size-4" />
            <p className="text-sm">Discord</p>
            <Icons.ArrowUpRight className="size-3.5" />
          </Button>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

const ThemeSwitcher = () => {
  const { hydrated, selectedTheme, setTheme } = useSafeTheme();

  const css = {
    icon: "size-4.25",
    trigger: "rounded-xl",
  };

  if (!hydrated) {
    return null;
  }

  return (
    <Tabs value={selectedTheme}>
      <TabsList className="gap-0.5 border-0 bg-bg-900">
        <TabsTrigger value="light" onClick={() => setTheme("light")} className={css.trigger}>
          <Icons.Sun className={css.icon} />
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => setTheme("dark")} className={css.trigger}>
          <Icons.Moon className={css.icon} />
        </TabsTrigger>
        <TabsTrigger value="system" onClick={() => setTheme("system")} className={css.trigger}>
          <Icons.Monitor className={css.icon} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
