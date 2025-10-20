import { FormControl, FormField, FormMessage } from "@/main/shadcn/components/ui/form";
import { FormItem } from "@/main/shadcn/components/ui/form";
import { Form } from "@/main/shadcn/components/ui/form";
import { Input } from "@/main/shadcn/components/ui/input";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import { DeepPartialSkipArrayKey, UseFormReturn } from "react-hook-form";
import z from "zod";
import { TradeFormSchema } from "../trade";
import { AmountSuggestionButtons } from "./amount-sugg-buttons";
import { useEffect } from "react";
import { usePrices } from "@/main/wrappers/components/prices-provider";
import { LoadingButton } from "@/main/components/ui/loading-button";
import { SubscriptDiv } from "@/main/components/ui/subscript-div";
import { numberToUsd } from "@repo/common/utils/currency";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/main/components/ui/connect-wallet-button";

type T_TradeForm = {
  form: UseFormReturn<z.input<typeof TradeFormSchema>>;
  formData: DeepPartialSkipArrayKey<z.input<typeof TradeFormSchema>>;
  amount: number;
  handleClick: () => void;
  loading: string | null;
  balanceEth: number;
  balanceToken: number;
  actionSelected: string;
  getBalanceAmount: () => number;
};

export const TradeForm = ({ form, formData, amount, handleClick, loading, balanceEth, balanceToken, actionSelected, getBalanceAmount }: T_TradeForm) => {
  const { ethUsdPrice } = usePrices();
  const { address } = useAccount();

  useEffect(() => {
    form.clearErrors("amount");

    if (formData.amount && Number(formData.amount) > getBalanceAmount()) {
      form.setError("amount", { message: "Amount greater than balance" });
    }
  }, [formData.amount, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleClick)}>
        <div className="w-full flex flex-col gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="w-full flex items-center border rounded-md overflow-hidden">
                    <div className="w-3/12 flex items-center justify-center py-3 border-r">
                      <p className="text-xs font-medium text-subtext">Amount</p>
                    </div>
                    <div className="w-9/12 flex items-center justify-end gap-2 px-4">
                      <Input
                        placeholder={"0.00"}
                        type="number"
                        autoComplete="off"
                        {...field}
                        value={field.value as string}
                        className={cn(
                          "w-full bg-transparent dark:bg-transparent text-sm font-medium outline-none text-end border-none outline-none focus-none focus-visible:ring-0"
                        )}
                      />
                      {actionSelected == "Sell" ? <Icons.Coin className="size-4 text-subtext" /> : <Icons.Ether className="size-4 text-subtext" />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {actionSelected == "Sell" ? null : <p className="text-xs font-medium text-subtext text-end">≈ ${numberToUsd(Number(amount) * ethUsdPrice)}</p>}

          <AmountSuggestionButtons form={form} amount={amount} balanceEth={balanceEth} balanceToken={balanceToken} actionSelected={actionSelected} />

          <div className="w-full flex flex-col gap-2 mt-2">
            {address ? <TradeButton actionSelected={actionSelected} loading={loading} /> : <ConnectWalletButton />}
          </div>
        </div>
      </form>
    </Form>
  );
};

export const TradeButton = ({ actionSelected, loading }: { actionSelected: string; loading: string | null }) => {
  return (
    <LoadingButton loading={loading} variant={actionSelected == "Buy" ? "buy" : "sell"} className={cn("w-full rounded-sm mt-2")} type="submit">
      <SubscriptDiv baseItem={<Icons.Trade />} subscriptItem={<p className="text-sm font-medium">{actionSelected == "Buy" ? "+" : "-"}</p>} />
      <p className="">{actionSelected == "Buy" ? "Buy" : "Sell"}</p>
    </LoadingButton>
  );
};
