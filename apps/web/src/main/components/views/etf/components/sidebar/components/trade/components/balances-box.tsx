import { NumberDiv } from "@/main/components/ui/number-div";
import { cn } from "@/main/shadcn/lib/utils";

export const BalancesBox = ({ balanceEth, balanceToken }: { balanceEth: number; balanceToken: number }) => {
  const options = ["ETH", "ETF"];

  const getValue = (index: number): number => {
    switch (index) {
      case 0:
        return balanceEth;
      case 1:
        return balanceToken;
      default:
        return 0;
    }
  };

  return (
    <div className={cn("w-full grid border divide-x rounded-sm", "grid-cols-2 relative")}>
      {options.map((option, index) => (
        <div key={option} className="w-full flex flex-col items-center justify-center py-1.5 gap-1">
          <p className="text-xs font-medium text-subtext">{option}</p>
          <NumberDiv
            number={getValue(index)}
            symbolType={index == 0 ? "eth" : "coin"}
            color={getValue(index) == 0 ? "text-subtext" : getValue(index) > 0 ? "text-green-500" : "text-red-500"}
            pClassName="text-xs truncate"
            iconClassName="size-3.5"
          />
        </div>
      ))}
    </div>
  );
};
