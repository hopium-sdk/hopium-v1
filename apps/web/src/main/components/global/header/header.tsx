"use client";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";
import { Search } from "@/main/components/global/search/search";
import { Icons } from "@/main/utils/icons";
import { cn } from "@/main/shadcn/lib/utils";
import { useAccount } from "wagmi";
import { Suspense } from "react";
import { CONVEX } from "@/main/lib/convex";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          <div key={index} className="flex items-center gap-4">
            <Item />
            {index < items.length - 1 && <p className="text-border">|</p>}
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
      icon: <Icons.About />,
    },
    {
      label: "Docs",
      href: "/docs",
      icon: <Icons.Docs />,
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {links.map((link) => (
        <Link href={link.href} key={link.label}>
          <div className={cn("flex items-center hover:text-main", pathname === link.href && "text-main", link.label === "Docs" ? "gap-2" : "gap-1.75")}>
            {link.icon}
            <p className="text-sm font-medium whitespace-nowrap">{link.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

// const Balance = () => {
//   const { address } = useAccount();
//   const { balanceEth } = useBalanceEth();
//   return (
//     <>
//       {address && (
//         <div className={cn("w-fit items-center rounded-box h-8 border divide-x hidden lg:flex")}>
//           <div className="flex items-center justify-center pl-3 pr-2">
//             <Icons.Wallet className="size-4" />
//           </div>
//           <div className="flex items-center gap-0.75 pl-2 pr-3.5">
//             <div className="flex items-center justify-center">
//               <Icons.Ether className="size-3.75" />
//             </div>
//             <p className="text-xs font-medium">{balanceEth.toFixed(4)}</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

const Rewards = () => {
  const { address } = useAccount();
  const rewards = useQuery(CONVEX.api.fns.user.getUserRewards.default, address ? { userAddress: address as `0x${string}` } : "skip");

  return (
    <div className={cn("w-fit flex items-center gap-1.5 cursor-pointer bg-rewards-900 hover:opacity-80 rounded-box px-4 h-8 text-rewards")}>
      <div className="flex items-center justify-center">
        <Icons.Rewards className="size-4" />
      </div>
      {!rewards ? (
        <p className="text-sm font-bold whitespace-nowrap italic">Rewards</p>
      ) : (
        <p className="text-sm font-medium whitespace-nowrap">{rewards.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
      )}
    </div>
  );
};
