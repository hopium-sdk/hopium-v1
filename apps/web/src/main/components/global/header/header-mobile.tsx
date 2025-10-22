"use client";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";
import { Icons } from "@/main/utils/icons";
import Logo from "../../ui/logo";
import { SearchMobile } from "../search/search";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/main/shadcn/components/ui/sidebar";
import Link from "next/link";

export const HeaderMobile = () => {
  const { openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchOpen = () => {
    router.push("/search");
  };

  const handleSearchClose = () => {
    router.push("/");
  };

  return (
    <div className="h-13 border-b-0 items-center justify-between px-6 bg-bg flex lg:hidden">
      {pathname.startsWith("/search") ? (
        <SearchMobile handleSearchClose={handleSearchClose} />
      ) : (
        <>
          <Link href="/" className="flex items-center">
            <Logo className="size-6" />
          </Link>
          <div className="w-full flex items-center justify-end gap-4">
            <Icons.Search className="size-5" onClick={handleSearchOpen} />
            <Icons.Rewards className="size-5" />
            <ConnectWalletButton />
            <div className="flex items-center justify-center" onClick={() => setOpenMobile(!openMobile)}>
              <Icons.SidebarHandle className="size-5" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
