"use client";
import { cn } from "@/main/shadcn/lib/utils";
import { Header } from "@/main/components/global/header/header";
import { SidebarProvider } from "@/main/components/global/sidebar/sidebar-provider";
import { Footer } from "@/main/components/global/footer/footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={cn("w-screen h-screen flex flex-1 flex-col overflow-hidden")}>
        <SidebarProvider>
          <Header />
          <div className="flex flex-1 overflow-hidden">{children}</div>
          <Footer />
        </SidebarProvider>
      </div>
    </>
  );
}
