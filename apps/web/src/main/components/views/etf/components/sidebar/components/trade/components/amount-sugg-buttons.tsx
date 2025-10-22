import { NUMBERS_WEB } from "@/main/utils/numbers";
import { cn } from "@/main/shadcn/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TradeFormSchema } from "../trade";
import z from "zod";

type T_AmountSuggestionButtons = {
  form: UseFormReturn<z.input<typeof TradeFormSchema>>;
  amount: number;
  balanceEth: number;
  balanceToken: number;
  actionSelected: string;
};

export const AmountSuggestionButtons = ({ form, amount, balanceEth, balanceToken, actionSelected }: T_AmountSuggestionButtons) => {
  const suggestions = [25, 50, 75, 100];

  const css = {
    suggestion_option_div: "border flex items-center justify-center py-2 rounded-md cursor-pointer",
    suggestion_option_p: "text-sm font-semibold uppercase text-subtext px-4",
    buy_hover: "hover:border-buy",
    sell_hover: "hover:border-sell",
    buy_border: "border-buy",
    sell_border: "border-sell",
  };

  const handleSuggestionClick = (suggestion: number) => {
    form.clearErrors("amount");

    const calcAmount = calculateAmount(suggestion);

    if (amount?.toString() !== calcAmount.toString() && calcAmount > 0) {
      form.setValue("amount", calcAmount.toString());
    } else {
      form.setValue("amount", "");
    }
  };

  const calculateAmount = (suggestion: number) => {
    const balanceAmount = getBalanceAmount();

    if (balanceAmount == 0) {
      return 0;
    }

    const result = (suggestion / 100) * balanceAmount;
    // if (suggestion == 100) {
    //   return balanceAmount;
    // }

    return NUMBERS_WEB.truncateDecimals(result, result < 1 ? 7 : 3);
  };

  const getBalanceAmount = () => {
    if (actionSelected == "Sell") {
      return balanceToken;
    }

    return balanceEth;
  };

  const isSelected = (suggestion: number) => {
    if (amount == 0) {
      return false;
    }

    return amount?.toString() === calculateAmount(suggestion).toString();
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion}
          className={cn(
            css.suggestion_option_div,
            isSelected(suggestion) ? (actionSelected == "Buy" ? css.buy_border : css.sell_border) : "",
            actionSelected == "Buy" ? css.buy_hover : css.sell_hover
          )}
          onClick={() => handleSuggestionClick(suggestion)}
        >
          <p className={css.suggestion_option_p}>{suggestion}%</p>
        </div>
      ))}
    </div>
  );
};
