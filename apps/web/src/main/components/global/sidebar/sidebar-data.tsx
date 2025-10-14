import { Icons } from "@/main/utils/icons";

export type T_SidebarLink = {
  title: string;
  icon: React.ElementType;
  url: string;
};

export type T_SidebarList = {
  title: string;
  links: T_SidebarLink[];
};

export const sidebarList: T_SidebarList[] = [
  {
    title: "Explore",
    links: [
      {
        title: "Dashboard",
        url: "/etfs",
        icon: Icons.Dashboard,
      },
      {
        title: "Recently Created",
        url: "/etfs/recently-created",
        icon: Icons.RecentlyCreated,
      },
      {
        title: "Most Liquidity",
        url: "/etfs/most-liquidity",
        icon: Icons.MostLiquidity,
      },
      {
        title: "Most Cap",
        url: "/etfs/most-cap",
        icon: Icons.MostCap,
      },
      {
        title: "Least Tokens",
        url: "/etfs/least-tokens",
        icon: Icons.LeastTokens,
      },
      {
        title: "Most Tokens",
        url: "/etfs/most-tokens",
        icon: Icons.MostTokens,
      },
    ],
  },
  {
    title: "Categories",
    links: [
      {
        title: "Crypto",
        url: "/categories/crypto",
        icon: Icons.Crypto,
      },
      {
        title: "Alts",
        url: "/categories/alts",
        icon: Icons.Alts,
      },
      {
        title: "Memes",
        url: "/categories/memes",
        icon: Icons.Memes,
      },
      {
        title: "Defi",
        url: "/categories/defi",
        icon: Icons.Defi,
      },
      {
        title: "Gaming",
        url: "/categories/gaming",
        icon: Icons.Gaming,
      },
      {
        title: "AI",
        url: "/categories/ai",
        icon: Icons.AI,
      },
      {
        title: "Dex",
        url: "/categories/dex",
        icon: Icons.Dex,
      },
    ],
  },
];
