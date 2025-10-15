import { formatAddress } from "@repo/common/utils/address";
import { getExplorerAddressUrl } from "@repo/common/utils/explorer";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import Link from "next/link";
import { CONSTANTS } from "@/main/lib/constants";

const options = [
  { bg950: "bg-blue-100 dark:bg-blue-950", bg500: "bg-blue-500", text: "text-blue-500" },
  { bg950: "bg-green-100 dark:bg-green-950", bg500: "bg-green-500", text: "text-green-500" },
  { bg950: "bg-yellow-100 dark:bg-yellow-950", bg500: "bg-yellow-500", text: "text-yellow-500" },
  { bg950: "bg-red-100 dark:bg-red-950", bg500: "bg-red-500", text: "text-red-500" },
  { bg950: "bg-orange-100 dark:bg-orange-950", bg500: "bg-orange-500", text: "text-orange-500" },
  { bg950: "bg-pink-100 dark:bg-pink-950", bg500: "bg-pink-500", text: "text-pink-500" },
  { bg950: "bg-gray-100 dark:bg-gray-950", bg500: "bg-gray-500", text: "text-gray-500" },
  { bg950: "bg-teal-100 dark:bg-teal-950", bg500: "bg-teal-500", text: "text-teal-500" },
  { bg950: "bg-lime-100 dark:bg-lime-950", bg500: "bg-lime-500", text: "text-lime-500" },
  { bg950: "bg-indigo-100 dark:bg-indigo-950", bg500: "bg-indigo-500", text: "text-indigo-500" },
  { bg950: "bg-fuchsia-100 dark:bg-fuchsia-950", bg500: "bg-fuchsia-500", text: "text-fuchsia-500" },
  { bg950: "bg-violet-100 dark:bg-violet-950", bg500: "bg-violet-500", text: "text-violet-500" },
  { bg950: "bg-cyan-100 dark:bg-cyan-950", bg500: "bg-cyan-500", text: "text-cyan-500" },
  { bg950: "bg-emerald-100 dark:bg-emerald-950", bg500: "bg-emerald-500", text: "text-emerald-500" },
  { bg950: "bg-sky-100 dark:bg-sky-950", bg500: "bg-sky-500", text: "text-sky-500" },
  { bg950: "bg-amber-100 dark:bg-amber-950", bg500: "bg-amber-500", text: "text-amber-500" },
  { bg950: "bg-rose-100 dark:bg-rose-950", bg500: "bg-rose-500", text: "text-rose-500" },
];

export const getStaticColor = (address: string) => {
  const hash = address.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return options[hash % options.length] ?? options[0];
};

export const getRandomColor = () => {
  return options[Math.floor(Math.random() * options.length)] ?? options[0];
};

export const getAddressColor = getStaticColor;

export type T_AvatarImage = {
  address: string;
  iconVariant?: "user" | "coin" | "contract";
  iconClassName?: string;
  iconColor?: string;
  withBox?: boolean;
  boxClassName?: string;
};

export const AvatarImage = ({ address, boxClassName, iconClassName, iconColor, withBox = false, iconVariant = "user" }: T_AvatarImage) => {
  const color = getAddressColor(address);

  const icons = {
    user: Icons.User,
    coin: Icons.Coin,
    contract: Icons.Contract,
  };

  const render = () => {
    const IconComponent = icons[iconVariant];
    return <IconComponent className={cn("size-4", iconColor ?? color?.text, iconClassName)} />;
  };

  if (withBox) {
    return <div className={cn("size-6 rounded-sm flex items-center justify-center", color?.bg950, boxClassName)}>{render()}</div>;
  }

  return render();
};

type T_Avatar = {
  address: string;
  withImage?: boolean;
  withLink?: boolean;
  withLinkIcon?: boolean;
  withLinkColor?: boolean;
  linkType?: "explorer" | "platform";
  className?: string;
  imageBoxClassName?: string;
  imageIconClassName?: string;
  pClassName?: string;
  linkIconClassName?: string;
  iconVariant?: "user" | "coin" | "contract";
};

export const Avatar = ({
  address,
  withImage = true,
  withLink = true,
  withLinkIcon = false,
  withLinkColor = false,
  className,
  imageBoxClassName,
  imageIconClassName,
  pClassName,
  linkType = "explorer",
  linkIconClassName,
  iconVariant = "user",
}: T_Avatar) => {
  const color = getAddressColor(address);

  const render = () => {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full w-fit", withLinkColor ? "bg-main-900" : color?.bg950, className)}>
        {withImage && (
          <AvatarImage
            address={address}
            boxClassName={imageBoxClassName}
            iconClassName={imageIconClassName}
            iconColor={withLinkColor ? "text-main" : undefined}
            iconVariant={iconVariant}
          />
        )}
        <p className={cn("text-xs font-medium", withLinkColor ? "text-main" : color?.text, pClassName)}>{formatAddress(address)}</p>
        {withLinkIcon && <Icons.ArrowUpRight className={cn("w-3.5 h-3.5 text-main -ml-0.5", withLinkColor ? "text-main" : color?.text, linkIconClassName)} />}
      </div>
    );
  };

  const explorerLink = getExplorerAddressUrl({ address, network: CONSTANTS.networkSelected });
  const platformLink = `/profile/${address}`;

  const href = linkType === "explorer" ? explorerLink : platformLink;

  if (withLink) {
    return (
      <Link href={href} target={linkType === "explorer" ? "_blank" : undefined} className="hover:opacity-80">
        {render()}
      </Link>
    );
  }

  return render();
};
