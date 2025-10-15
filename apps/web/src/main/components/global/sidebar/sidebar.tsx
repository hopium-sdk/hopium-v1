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
  const [watchlistCollapsed, setWatchlistCollapsed] = useState({
    isCollapsed: false,
    default: true,
  });

  return (
    <ScnSidebar collapsible="none" {...props}>
      {!watchlistCollapsed.isCollapsed ? (
        <ResizablePanelGroup direction="vertical" className="flex flex-1 flex-col overflow-hidden gap-0.75" autoSaveId={"sidebar"}>
          <ResizablePanel defaultSize={70} className="min-h-[300px] flex flex-col">
            <SidebarInside />
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-transparent" />
          <ResizablePanel defaultSize={30} className="min-h-[110px] flex flex-1">
            <WatchlistInside watchlistCollapsed={watchlistCollapsed} setWatchlistCollapsed={setWatchlistCollapsed} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="w-full flex flex-1 flex-col gap-1.5">
          <div className="w-full flex flex-1 flex-col">
            <SidebarInside />
          </div>
          <WatchlistInside watchlistCollapsed={watchlistCollapsed} setWatchlistCollapsed={setWatchlistCollapsed} />
        </div>
      )}
    </ScnSidebar>
  );
}

type T_WatchlistInside = {
  watchlistCollapsed: {
    isCollapsed: boolean;
    default: boolean;
  };
  setWatchlistCollapsed: (collapsed: { isCollapsed: boolean; default: boolean }) => void;
};

const WatchlistInside = ({ watchlistCollapsed, setWatchlistCollapsed }: T_WatchlistInside) => {
  return (
    <div className="w-full flex flex-col overflow-hidden border-t">
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
              <div className="flex items-center">
                <Logo className="size-6 wiggle" color="var(--fg)" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4 flex flex-col gap-4 mt-2">
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
      <p className="text-xs font-medium text-subtext pl-2">{items.title}</p>
      <div>
        {items.links.map((link) => (
          <SidebarMenuItem key={link.title}>
            <Link href={link.url}>
              <SidebarMenuButton tooltip={link.title} className={cn("hover:bg-transparent hover:text-main", isLinkActive(link) && "text-main")}>
                {link.icon && <link.icon />}
                <span className="text-sm font-medium">{link.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </div>
    </SidebarMenu>
  );
};
