import TimeAgo from "react-timeago";
import { makeIntlFormatter } from "react-timeago/defaultFormatter";
import { Icons } from "@/main/utils/icons";
import { cn } from "@/main/shadcn/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

type T_Timestamp = {
  timestamp: number;
  withIcon?: boolean;
  withLink?: boolean;
  className?: string;
  iconClassName?: string;
  linkClassName?: string;
  pClassName?: string;
  linkHref?: string;
};

export const Timestamp = ({ timestamp, withIcon = true, withLink = true, className, iconClassName, linkClassName, pClassName, linkHref }: T_Timestamp) => {
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);

  const intlFormatter = makeIntlFormatter({
    style: "narrow",
    locale: "en-GB",
  });

  const render = () => {
    return (
      <Suspense>
        <div className={cn("flex items-center gap-1.5")}>
          {withIcon && <Icons.Clock className={cn("size-4.5", iconClassName)} />}
          <p className={cn(pClassName)}>
            <TimeAgo date={date} formatter={intlFormatter} component="span" />
          </p>
          {withLink && <Icons.ArrowUpRight className={cn("size-3.5", linkClassName)} />}
        </div>
      </Suspense>
    );
  };

  return (
    <>
      {withLink ? (
        <Link href={linkHref ?? ""} target="_blank" className={cn("flex items-center gap-2 hover:opacity-70 text-subtext", className)}>
          {render()}
        </Link>
      ) : (
        <div className={cn("flex items-center gap-2 text-subtext", className)}>{render()}</div>
      )}
    </>
  );
};
