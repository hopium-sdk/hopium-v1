import { ConnectKitButton } from "connectkit";
import { Button } from "@/main/shadcn/components/ui/button";
import { Icons } from "@/main/utils/icons";
import { AvatarImage } from "@/main/components/ui/avatar";
import { formatAddress } from "@repo/common/utils/address";
import { cn } from "@/main/shadcn/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/main/shadcn/components/ui/dropdown-menu";
import { useAccount, useDisconnect } from "wagmi";
import { getExplorerAddressUrl } from "@repo/common/utils/explorer";
import { COMMON_CONSTANTS } from "@repo/common/utils/constants";
import { toast } from "sonner";
import { Drawer, DrawerTitle, DrawerContent, DrawerHeader, DrawerTrigger } from "@/main/shadcn/components/ui/drawer";

export const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return isConnected ? <ConnectedBox address={address || ""} /> : <ConnectButton show={show || (() => {})} />;
      }}
    </ConnectKitButton.Custom>
  );
};

const ConnectButton = ({ show }: { show: () => void }) => {
  return (
    <>
      <div className="md:hidden" onClick={show}>
        <Icons.Wallet className="size-5" />
      </div>
      <Button size={"default"} onClick={show} className="hidden md:flex">
        <Icons.Wallet className="size-4" />
        <p className="text-sm">Connect Wallet</p>
      </Button>
    </>
  );
};

const ConnectedBox = ({ address }: { address: string }) => {
  const { disconnect } = useDisconnect();

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <>
      <div className="hidden md:block">
        <ConnectedBoxDesktop address={address} copyAddress={copyAddress} disconnect={disconnect} />
      </div>
      <div className="md:hidden">
        <ConnectedBoxMobile address={address} copyAddress={copyAddress} disconnect={disconnect} />
      </div>
    </>
  );
};

const ConnectedBoxMobile = ({ address, copyAddress, disconnect }: { address: string; copyAddress: () => void; disconnect: () => void }) => {
  const css = {
    div: "flex items-center gap-2 py-4 px-5",
    icon: "size-4",
    p: "text-xs font-medium",
  };
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <AvatarImage address={address} boxClassName="size-8" iconClassName="size-5" withBox />
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm min-h-96">
            <DrawerHeader className="border-b">
              <DrawerTitle className="hidden">Wallet</DrawerTitle>
              <AvatarAddressBar address={address || ""} variant="lg" withSubtext />
            </DrawerHeader>
            <div className="flex flex-col divide-y border-b">
              <div className={cn(css.div)} onClick={() => copyAddress()}>
                <Icons.Copy className={cn(css.icon)} />
                <p className={cn(css.p)}>Copy Address</p>
              </div>
              <div className={cn(css.div)} onClick={() => window.open(getExplorerAddressUrl({ address, network: COMMON_CONSTANTS.networkSelected }), "_blank")}>
                <Icons.Explorer className={cn(css.icon)} />
                <p className={cn(css.p)}>View on Explorer</p>
              </div>
              <div className={cn(css.div, "text-red")} onClick={() => disconnect()}>
                <Icons.Logout className={cn(css.icon)} />
                <p className={cn(css.p)}>Logout</p>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const ConnectedBoxDesktop = ({ address, copyAddress, disconnect }: { address: string; copyAddress: () => void; disconnect: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <>
          <div className="md:hidden">
            <AvatarImage address={address || ""} boxClassName="size-8" iconClassName="size-5" withBox />
          </div>
          <div className={cn("hidden md:flex items-center gap-2 cursor-pointer hover:bg-bg-900 rounded-lg px-4 h-10 border")}>
            <AvatarAddressBar address={address || ""} />
            <Icons.ChevronDown className="size-4" />
          </div>
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <AvatarAddressBar address={address || ""} withSubtext variant="lg" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          <Icons.Copy className="size-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(getExplorerAddressUrl({ address, network: COMMON_CONSTANTS.networkSelected }), "_blank")}>
          <Icons.Explorer className="size-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="text-red hover:text-red">
          <Icons.Logout className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AvatarAddressBar = ({ address, variant = "default", withSubtext = false }: { address: string; variant?: "default" | "lg"; withSubtext?: boolean }) => {
  const { chain } = useAccount();
  const css = {
    default: {
      avatar: {
        box: "size-7",
        icon: "size-5",
      },
      p: "text-sm font-medium",
      subtext: "text-sm text-subtext font-normal",
    },
    lg: {
      avatar: {
        box: "size-8",
        icon: "size-6",
      },
      p: "text-sm font-medium",
      subtext: "text-sm text-subtext font-normal",
    },
  };

  return (
    <div className="flex items-center gap-2">
      <AvatarImage address={address || ""} boxClassName={css[variant].avatar.box} iconClassName={css[variant].avatar.icon} withBox />
      <div className="flex flex-col items-start">
        <p className={css[variant].p}>{formatAddress(address || "")}</p>
        {withSubtext && <p className={css[variant].subtext}>{chain?.name}</p>}
      </div>
    </div>
  );
};
