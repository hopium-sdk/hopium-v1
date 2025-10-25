import { Icons } from "@/main/utils/icons";
import { ConnectWalletButton } from "../../ui/connect-wallet-button";
import Logo from "../../ui/logo";

export const ConnectWalletPrompt = ({ alwaysFullWidthButton = false }: { alwaysFullWidthButton?: boolean }) => {
  const items = ["Trade on Hopium", "View your positions", "Earn $HOP rewards", "Create coupons for Affiliate Program"];
  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden bg-bg">
      <div className="min-w-xs bg-bg-900 rounded-base px-6 py-10">
        <Logo className="size-8" />

        <div className="pt-6">
          <p className="text-xl font-medium">Connect your wallet</p>
          <p className="text-sm pt-1">By connecting your wallet, you can :</p>
          <div className="mt-4 flex flex-col gap-2">
            {items.map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <Icons.CheckCircle className="size-4" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <ConnectWalletButton alwaysFullWidth={alwaysFullWidthButton} />
        </div>
      </div>
    </div>
  );
};
