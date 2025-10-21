"use client";
import { cn } from "@/main/shadcn/lib/utils";
import { Header } from "@/main/components/global/header/header";
import { SidebarProvider } from "@/main/components/global/sidebar/sidebar-provider";
import { Footer } from "@/main/components/global/footer/footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={cn("w-screen h-screen flex flex-1 flex-col overflow-hidden bg-bg-1000")}>
        <SidebarProvider>
          <div className="flex flex-1 flex-col overflow-hidden gap-1 p-1">
            <div className="border rounded-md overflow-hidden">
              <Header />
            </div>
            <div className="flex flex-1 overflow-hidden">{children}</div>
            <div className="border rounded-md overflow-hidden">
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}
