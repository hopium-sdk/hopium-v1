import { Toaster } from "@/main/shadcn/components/ui/sonner";
import AppLayout from "@/main/components/layouts/components/app-layout";
// import { ThemeToggle } from "@/main/components/ui/theme-toggle";
import { GlobalProvider } from "@/main/wrappers/global-provider";

export const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GlobalProvider>
        <AppLayout>{children}</AppLayout>
        {/* <div className="fixed bottom-10 right-10 flex justify-center">
          <ThemeToggle />
        </div> */}
        <Toaster position="top-right" />
      </GlobalProvider>
    </>
  );
};
