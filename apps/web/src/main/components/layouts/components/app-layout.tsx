"use client";
import { cn } from "@/main/shadcn/lib/utils";
import { Header } from "@/main/components/global/header/header";
import { SidebarProvider } from "@/main/components/global/sidebar/sidebar-provider";
import { Footer } from "@/main/components/global/footer/footer";
import { HeaderMobile } from "../../global/header/header-mobile";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={cn("w-screen h-screen flex flex-1 flex-col overflow-hidden bg-bg-1000")}>
        <SidebarProvider>
          <LayoutInside>{children}</LayoutInside>
        </SidebarProvider>
      </div>
    </>
  );
}

const LayoutInside = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:gap-1 lg:p-1">
      <Suspense>
        <div className={cn("border-b lg:border lg:rounded-lg overflow-hidden")}>
          <Header />
          <HeaderMobile />
        </div>
      </Suspense>
      <div className="flex flex-1 overflow-hidden">{children}</div>
      <div className="border rounded-lg overflow-hidden hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};
