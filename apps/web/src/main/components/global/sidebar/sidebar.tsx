"use client";
import * as React from "react";
import { Sidebar as ScnSidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/main/shadcn/components/ui/sidebar";
import { T_SidebarLink, T_SidebarList, sidebarList } from "@/main/components/global/sidebar/sidebar-data";
import Logo from "@/main/components/ui/logo";
import { cn } from "@/main/shadcn/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Watchlist } from "@/main/components/global/watchlist/watchlist";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/main/shadcn/components/ui/resizable";

export function Sidebar({ ...props }: React.ComponentProps<typeof ScnSidebar>) {
  return (
    <ScnSidebar collapsible="offcanvas" {...props}>
      <SidebarMobile />
      <SidebarDesktop />
    </ScnSidebar>
  );
}

const SidebarMobile = () => {
  return (
    <div className="block md:hidden w-full flex flex-col overflow-hidden">
      <SidebarInside />
    </div>
  );
};

const SidebarDesktop = () => {
  const [watchlistCollapsed, setWatchlistCollapsed] = useState({
    isCollapsed: true,
    default: true,
  });

  return (
    <div className="hidden md:flex flex-1 flex-col overflow-hidden">
      {!watchlistCollapsed.isCollapsed ? (
        <ResizablePanelGroup direction="vertical" className="flex flex-1 flex-col overflow-hidden" autoSaveId={"sidebar"}>
          <ResizablePanel defaultSize={70} className="min-h-[300px] flex flex-col rounded-box bg-bg">
            <SidebarInside />
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-transparent pt-box" />
          <ResizablePanel defaultSize={30} className="min-h-[110px] flex flex-1 rounded-box bg-bg">
            <WatchlistInside watchlistCollapsed={watchlistCollapsed} setWatchlistCollapsed={setWatchlistCollapsed} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="w-full flex flex-1 flex-col gap-box">
          <div className="w-full flex flex-1 flex-col rounded-box bg-bg">
            <SidebarInside />
          </div>
          <div className="rounded-box bg-bg">
            <WatchlistInside watchlistCollapsed={watchlistCollapsed} setWatchlistCollapsed={setWatchlistCollapsed} />
          </div>
        </div>
      )}
    </div>
  );
};

type T_WatchlistInside = {
  watchlistCollapsed: {
    isCollapsed: boolean;
    default: boolean;
  };
  setWatchlistCollapsed: (collapsed: { isCollapsed: boolean; default: boolean }) => void;
};

const WatchlistInside = ({ watchlistCollapsed, setWatchlistCollapsed }: T_WatchlistInside) => {
  return (
    <div className="w-full flex flex-col overflow-hidden">
      <Suspense>
        <Watchlist collapsed={watchlistCollapsed} setCollapsed={setWatchlistCollapsed} />
      </Suspense>
    </div>
  );
};

const SidebarInside = () => {
  return (
    <>
      <SidebarHeader className="px-4 mt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent cursor-pointer w-fit">
              <Link href={"/"} className="flex items-center">
                <Logo className="size-6.5 wiggle" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4 flex flex-col gap-4 mt-2 pb-4">
        <Suspense>
          {sidebarList.map((list) => (
            <SidebarList key={list.title} items={list} />
          ))}
        </Suspense>
      </SidebarContent>
    </>
  );
};

export const SidebarList = ({ items }: { items: T_SidebarList }) => {
  const pathname = usePathname();

  const isLinkActive = (link: T_SidebarLink) => {
    if (pathname == "/" && link.url == "/etfs") return true;
    return link.url === pathname;
  };
  return (
    <SidebarMenu className="flex flex-col gap-2">
      <p className="text-sm font-medium text-subtext pl-2">{items.title}</p>
      <div className="flex flex-col gap-0.5">
        {items.links.map((link) => (
          <SidebarMenuItem key={link.title}>
            <Link href={link.url}>
              <SidebarMenuButton tooltip={link.title} className={cn("hover:bg-bg-900 pl-4 -translate-x-2", isLinkActive(link) && "bg-bg-900")}>
                <div className="flex items-center justify-center">{link.icon && <link.icon className={cn("size-4.5")} />}</div>
                <span className="text-sm font-medium">{link.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </div>
    </SidebarMenu>
  );
};
