import { SidebarProvider as ScnSidebarProvider } from "@/main/shadcn/components/ui/sidebar";
import { Sidebar } from "@/main/components/global/sidebar/sidebar";

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScnSidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar className="py-1 pl-1" />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </ScnSidebarProvider>
  );
};
