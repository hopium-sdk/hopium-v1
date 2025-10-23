import { NumberDiv } from "@/main/components/ui/number-div";

type SymbolType = "eth" | "usd";

type T_NumberTab = {
  title: string;
  value: number;
  color?: string;
  symbolType?: SymbolType;
  noDecimals?: boolean;
  pClassName?: string;
  blink?: boolean;
};

export const NumberTab = ({ title, value, color, symbolType, noDecimals, pClassName, blink }: T_NumberTab) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-0.5 bg-bg-900 rounded-base px-4 py-2">
      <p className="text-sm font-medium text-subtext">{title}</p>
      <NumberDiv number={value} symbolType={symbolType} color={color} noDecimals={noDecimals} pClassName={pClassName} blink={blink} />
    </div>
  );
};
