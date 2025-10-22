"use client";
import { WagmiProvider, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { CONSTANTS } from "@/main/lib/constants";
import { defaultFont } from "@/main/utils/fonts";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [base],
    transports: {},

    // Required API Keys
    walletConnectProjectId: CONSTANTS.walletConnectProjectId,

    // Required App Info
    appName: "Hopium",

    // Optional App Info
    appDescription: "Hopium",
    appUrl: "https://hopium.xyz", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)

    enableFamily: false,
  })
);

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-body-background": "var(--color-bg)",
            "--ck-body-background-transparent": "var(--color-bg)",
            "--ck-primary-button-background": "var(--color-bg)",
            "--ck-body-divider": "var(--color-border)",
            "--ck-font-family": defaultFont.style.fontFamily,
            "--ck-modal-box-shadow": "none",

            // Mobile
            "--ck-body-background-tertiary": "var(--color-bg)",
            "--ck-tertiary-box-shadow": "inset 0 0 0 1px var(--color-border)",
            "--ck-secondary-button-background": "var(--color-bg-900)",
          }}
          theme="midnight"
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
