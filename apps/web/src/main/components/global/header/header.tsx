"use client";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";
import { Search } from "@/main/components/global/search/search";
import { Icons } from "@/main/utils/icons";
import { cn } from "@/main/shadcn/lib/utils";
import { useAccount } from "wagmi";
import { Suspense, useState } from "react";
import { CONVEX } from "@/main/lib/convex";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cursiveFont } from "@/main/utils/fonts";
import { RewardsModal } from "../../views/rewards/rewards";

export const Header = () => {
  const items: (() => React.ReactNode)[] = [Links, Rewards, ConnectWalletButton];
  return (
    <div className="h-13 border-b-0 items-center justify-between px-6 bg-bg hidden lg:flex gap-4">
      <div className="w-full flex items-center">
        <Suspense>
          <Search />
        </Suspense>
      </div>
      <div className="flex items-center justify-end gap-4">
        {items.map((Item, index) => (
          <div key={index}>
            <Item />
          </div>
        ))}
      </div>
    </div>
  );
};

const Links = () => {
  const pathname = usePathname();
  const links: { label: string; href: string; icon: React.ReactNode }[] = [
    {
      label: "About",
      href: "/about",
      icon: <Icons.About className="size-4.5" />,
    },
    {
      label: "Docs",
      href: "/docs",
      icon: <Icons.Docs className="size-4.5" />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <Link href={link.href} key={link.label}>
          <div
            className={cn(
              "flex items-center hover:bg-bg-900 rounded-base px-4 h-9",
              pathname === link.href && "bg-bg-900",
              link.label === "Docs" ? "gap-2" : "gap-1.75"
            )}
          >
            <div className="flex items-center justify-center">{link.icon}</div>
            <p className="text-sm font-medium whitespace-nowrap">{link.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const Rewards = () => {
  const { address } = useAccount();
  const rewards = useQuery(CONVEX.api.fns.user.getUserRewards.default, address ? { userAddress: address as `0x${string}` } : "skip");
  // const rewards = 0;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div
        className={cn(
          "w-fit flex items-center gap-1.5 cursor-pointer bg-rewards-900 hover:opacity-80 rounded-base h-9 text-rewards overflow-hidden",
          rewards && rewards > 0 ? "pl-3 pr-1" : "px-4"
        )}
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-center gap-2">
          {!rewards && <Icons.Rewards className="size-4" />}
          <p className={cn("text-lg whitespace-nowrap", cursiveFont.className)}>Rewards</p>

          {rewards && rewards > 0 ? (
            <div className="flex items-center justify-center gap-1 bg-rewards/10 px-4 h-7 rounded-base-sm">
              <Icons.Rewards className="size-4" />
              <p className="text-sm font-medium whitespace-nowrap ">
                {rewards.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <RewardsModal modalOpen={modalOpen} setModalOpen={setModalOpen} rewards={rewards} />
    </>
  );
};
