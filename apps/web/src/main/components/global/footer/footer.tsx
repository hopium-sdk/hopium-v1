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
        <div className="flex items-center gap-2.5 bg-buy-900/70 rounded-full px-4 py-1">
          <PingCircle />
          <p className="text-sm font-medium text-green-500">Live</p>
        </div>
        <p className="text-border pl-1">|</p>
        <div className="flex items-center gap-1 text-subtext">
          <Icons.Ether />
          <p className="text-sm font-medium">{numberToUsd(ethUsdPrice)}</p>
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2.5">
        <p className="text-border pl-1">|</p>
        <div className="flex items-center gap-0">
          <Button variant="ghost" size="icon" className="text-subtext p-0">
            <Icons.Twitter className="size-4.25" />
          </Button>
          <Button variant="ghost" size="icon" className="text-subtext p-0">
            <Icons.Discord className="size-4.75" />
          </Button>
        </div>
        <p className="text-border pl-1">|</p>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

const ThemeSwitcher = () => {
  const { hydrated, selectedTheme, setTheme } = useSafeTheme();

  const css = {
    icon: "size-4.25",
    trigger: "data-[state=active]:bg-bg-800",
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
