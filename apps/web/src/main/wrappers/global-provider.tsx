import { ThemeProvider } from "@/main/wrappers/components/theme-provider";
import NavigationBarProvider from "@/main/wrappers/components/navigation-bar-provider";
import { WalletProvider } from "./components/wallet/wallet-provider";
import { ConvexClientProvider } from "./components/convex-provider";
import { PricesProvider } from "./components/prices-provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexClientProvider>
      <PricesProvider>
        <ThemeProvider>
          <WalletProvider>
            <NavigationBarProvider>{children}</NavigationBarProvider>
          </WalletProvider>
        </ThemeProvider>
      </PricesProvider>
    </ConvexClientProvider>
  );
};
