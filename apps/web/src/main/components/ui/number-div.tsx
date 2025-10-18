import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import { NUMBERS_WEB } from "@/main/utils/numbers";
import { BlinkP } from "./blink-p";

export type T_NumberDiv = {
  number: number;
  symbolType?: "eth" | "usd" | "coin" | "percent";
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  iconClassName?: string;
  pClassName?: string;
  displayZero?: boolean;
  noDecimals?: boolean;
  unformatted?: boolean;
  unformattedDecimals?: number;
  bracket?: boolean;
  blink?: boolean;
};

const css = {
  number_p: "text-sm font-medium",
};

export const NumberDiv = ({
  number,
  symbolType,
  color,
  icon: Icon,
  className,
  iconClassName,
  pClassName,
  displayZero = true,
  noDecimals = false,
  unformatted = false,
  unformattedDecimals = 9,
  bracket = false,
  blink = false,
}: T_NumberDiv) => {
  const renderNumber = () => {
    const PComponent = blink ? BlinkP : "p";
    return (
      <>
        {Icon && <Icon className={cn("size-3", color, iconClassName)} />}
        {symbolType == "eth" && <Icons.Ether className={cn("size-4 translate-x-0.5", color, iconClassName)} />}
        {symbolType == "coin" && <Icons.Coin className={cn("size-4", color, iconClassName)} />}
        <PComponent className={cn(css.number_p, color, pClassName)}>
          {bracket && <span>{"("}</span>}
          {symbolType == "usd" ? "$" : ""}
          {unformatted
            ? number.toLocaleString("en-US", { maximumFractionDigits: unformattedDecimals, minimumFractionDigits: unformattedDecimals })
            : noDecimals
              ? number.toLocaleString("en-US", { maximumFractionDigits: 0 })
              : NUMBERS_WEB.formatNumber(number)}
          {bracket && <span>{")"}</span>}
        </PComponent>
        {symbolType == "percent" && <p className={cn(css.number_p, color, pClassName)}>%</p>}
      </>
    );
  };

  const renderZero = () => {
    return <p className={cn(css.number_p, color, pClassName)}>-</p>;
  };

  return <div className={cn("w-fit flex items-center gap-1", className)}>{number != 0 ? renderNumber() : !displayZero ? renderZero() : renderNumber()}</div>;
};
