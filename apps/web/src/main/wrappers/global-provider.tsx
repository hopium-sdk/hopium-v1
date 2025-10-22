import { ThemeProvider } from "@/main/wrappers/components/theme-provider";
import NavigationBarProvider from "@/main/wrappers/components/navigation-bar-provider";
import { WalletProvider } from "./components/wallet-provider";
import { ConvexClientProvider } from "./components/convex-provider";
import { PricesProvider } from "./components/prices-provider";
import { BalanceProvider } from "./components/balance-provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexClientProvider>
      <ThemeProvider>
        <WalletProvider>
          <BalanceProvider>
            <PricesProvider>
              <NavigationBarProvider>{children}</NavigationBarProvider>
            </PricesProvider>
          </BalanceProvider>
        </WalletProvider>
      </ThemeProvider>
    </ConvexClientProvider>
  );
};
