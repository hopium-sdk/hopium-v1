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
    <div className="w-full flex flex-col items-center justify-center gap-0.5 border rounded-box p-1.5">
      <p className="text-sm font-medium text-subtext">{title}</p>
      <NumberDiv number={value} symbolType={symbolType} color={color} noDecimals={noDecimals} pClassName={pClassName} blink={blink} />
    </div>
  );
};
