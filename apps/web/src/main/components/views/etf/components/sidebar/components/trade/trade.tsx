"use client";
import { useState } from "react";
import z from "zod";
import { Icons } from "@/main/utils/icons";
import { C_Etf } from "@repo/convex/schema";
import { useForm, useWatch } from "react-hook-form";
import { previewToast } from "@/main/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBalance } from "@/main/hooks/use-balance";
import { ActionButtons } from "./components/action-buttons";
import { WalletBalanceButton } from "./components/wallet-balance-button";
import { TradeForm } from "./components/form";
import { BalancesBox } from "./components/balances-box";

export const TradeFormSchema = z.object({
  amount: z.coerce.number("Enter a valid amount").nonnegative("Enter a valid amount").min(0.0001, "Enter a valid amount"),
});

export const actionOptions = ["Buy", "Sell"];
export type T_ActionSelected = (typeof actionOptions)[number];

export const EtfTrade = ({ etf }: { etf: C_Etf }) => {
  const { balanceEthNumber, balanceTokenNumber, updateBalances } = useBalance({ tokenAddress: etf.contracts.etfTokenAddress as `0x${string}`, pollMs: 5000 });
  const [loading, setLoading] = useState<string | null>(null);
  const [actionSelected, setActionSelected] = useState<(typeof actionOptions)[number]>("Buy");

  const form = useForm({
    resolver: zodResolver(TradeFormSchema),
    defaultValues: { amount: "" },
  });

  const formData = useWatch({ control: form.control });

  const handleClick = async () => {
    const amount = Number(formData.amount);

    if (isNaN(amount) || amount < 0.0001) {
      form.setError("amount", { message: "Enter a valid amount" });
    }

    if (amount > getBalanceAmount()) {
      form.setError("amount", { message: "Amount greater than balance" });
    }

    // if (!onlyRugs.fns.bumpCoin) {
    //   form.setError("amount", { message: "Something went wrong" });
    //   setLoading(null);
    //   return;
    // }

    previewToast();

    // const fn = coinStatus == "queued" ? onlyRugs.fns.bumpCoin : raydium.fn.tradeCoin;
    // const { txHash, error } = await fn({ coin, amount, type: actionSelected, setLoading });

    // if (error) {
    //   form.setError("amount", { message: error });
    //   setLoading(null);
    //   return;
    // }

    // if (txHash) {
    //   setLoading(null);
    //   form.clearErrors("amount");

    //   const toastParams = getToastParams();
    //   successToast({
    //     title: toastParams?.title ?? "",
    //     description: toastParams?.description ?? "",
    //     url: SOLANA_COMMON.utils.tx.getSolscanTxHashUrl({ txHash }),
    //     urlType: "external",
    //   });
    // }

    await updateBalances();
  };

  const getBalanceAmount = (): number => {
    if (actionSelected == "Sell") {
      return balanceTokenNumber;
    }

    return balanceEthNumber;
  };

  const getToastParams = () => {
    switch (actionSelected) {
      case "Buy":
        return {
          title: "Coin Bought",
          description: `You bought ${etf.index.ticker} for ${formData.amount} ETH`,
        };
      case "Sell":
        return {
          title: "Coin Sold",
          description: `You sold ${formData.amount} ${etf.index.ticker}`,
        };
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 pb-1">
        <Icons.Trade className="size-4 text-subtext" />
        <p className="text-xs font-medium text-subtext">Trade</p>
      </div>

      <ActionButtons actionSelected={actionSelected} setActionSelected={setActionSelected} />

      <div className="flex items-center justify-end">
        <WalletBalanceButton
          form={form}
          amount={formData.amount as number}
          balanceEth={balanceEthNumber}
          balanceToken={balanceTokenNumber}
          actionSelected={actionSelected}
          getBalanceAmount={getBalanceAmount}
        />
      </div>

      <TradeForm
        form={form}
        formData={formData}
        amount={formData.amount as number}
        handleClick={handleClick}
        loading={loading}
        balanceEth={balanceEthNumber}
        balanceToken={balanceTokenNumber}
        actionSelected={actionSelected}
        getBalanceAmount={getBalanceAmount}
      />

      <div className="w-full pt-2">
        <BalancesBox balanceEth={balanceEthNumber} balanceToken={balanceTokenNumber} />
      </div>
    </div>
  );
};
