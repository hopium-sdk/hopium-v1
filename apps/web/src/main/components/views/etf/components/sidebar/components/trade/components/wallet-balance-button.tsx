import { NumberDiv } from "@/main/components/ui/number-div";
import { CONSTANTS } from "@/main/lib/constants";
import { Icons } from "@/main/utils/icons";
import { Separator } from "@/main/shadcn/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { NUMBERS_WEB } from "@/main/utils/numbers";
import { TradeFormSchema } from "../trade";

type T_WalletBalanceButton = {
  form: UseFormReturn<z.input<typeof TradeFormSchema>>;
  amount: number;
  balanceEth: number;
  balanceToken: number;
  actionSelected: string;
  getBalanceAmount: () => number;
};

export const WalletBalanceButton = ({ form, amount, balanceEth, balanceToken, actionSelected, getBalanceAmount }: T_WalletBalanceButton) => {
  const handleClick = () => {
    form.clearErrors("amount");

    if (amount?.toString() !== calculateTotalBalance().toString()) {
      form.setValue("amount", calculateTotalBalance().toString());
    } else {
      form.setValue("amount", "");
    }
  };

  const calculateTotalBalance = (): number => {
    if (actionSelected == "Sell") {
      return NUMBERS_WEB.truncateDecimals(balanceToken, 4);
    }

    return NUMBERS_WEB.truncateDecimals(balanceEth - CONSTANTS.minTxFee, 4);
  };

  return (
    <div className="flex items-center gap-2 rounded-full px-3 py-1 border hover:bg-accent cursor-pointer" onClick={handleClick}>
      {<Icons.Wallet className="size-4 text-subtext" />}
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
      <NumberDiv
        number={getBalanceAmount()}
        color="text-subtext"
        pClassName="text-xs"
        symbolType={actionSelected == "Sell" ? "coin" : "eth"}
        iconClassName={actionSelected == "Sell" ? "size-3.5" : "size-3.5"}
      />
    </div>
  );
};
