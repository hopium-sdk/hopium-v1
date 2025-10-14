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
import { useDisconnect } from "wagmi";

export const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return isConnected ? (
          <ConnectedBox address={address || ""} />
        ) : (
          <Button size={"default"} onClick={show} className="">
            <Icons.Wallet className="size-4" />
            <p className="text-sm">Connect Wallet</p>
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

const ConnectedBox = ({ address }: { address: string }) => {
  const { disconnect } = useDisconnect();

  const AvatarAddress = () => {
    return (
      <>
        <AvatarImage address={address || ""} boxClassName="size-7" iconClassName="size-4" withBox />
        <p className="text-xs font-medium">{formatAddress(address || "")}</p>
      </>
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={cn("flex items-center gap-2 cursor-pointer hover:bg-bg-900 rounded-md px-4 h-10")}>
          <AvatarAddress />
          <Icons.ChevronDown className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <AvatarAddress />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icons.User className="size-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.Copy className="size-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem>
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
