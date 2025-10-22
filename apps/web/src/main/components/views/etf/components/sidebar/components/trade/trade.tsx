"use client";
import { useState } from "react";
import z from "zod";
import { Icons } from "@/main/utils/icons";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtons } from "./components/action-buttons";
import { WalletBalanceButton } from "./components/wallet-balance-button";
import { TradeForm } from "./components/form";
import { BalancesBox } from "./components/balances-box";
import { useHopiumContracts } from "@/main/hooks/use-hopium-contracts";
import { useBalanceEth } from "@/main/wrappers/components/balance-provider";
import { SidebarBox } from "../../ui/box";
import { useBalanceEtf } from "@/main/hooks/use-balance-etf";

const MIN_AMOUNT = 0.00001;
export const TradeFormSchema = z.object({
  amount: z.coerce.number("Enter a valid amount").nonnegative("Enter a valid amount").min(MIN_AMOUNT, "Enter a valid amount"),
});

export const actionOptions = ["Buy", "Sell"];
export type T_ActionSelected = (typeof actionOptions)[number];

export const EtfTrade = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { buyEtf, sellEtf } = useHopiumContracts({ setLoading });

  const { balanceEtf } = useBalanceEtf({ etfId: etf.etf.details.etfId });
  const { balanceEth, updateBalanceEth } = useBalanceEth();

  const [actionSelected, setActionSelected] = useState<(typeof actionOptions)[number]>("Buy");

  const form = useForm({
    resolver: zodResolver(TradeFormSchema),
    defaultValues: { amount: "" },
  });

  const formData = useWatch({ control: form.control });

  const handleClick = async () => {
    const amount = Number(formData.amount);

    if (isNaN(amount) || amount < MIN_AMOUNT) {
      form.setError("amount", { message: "Enter a valid amount" });
    }

    if (amount > getBalanceAmount()) {
      form.setError("amount", { message: "Amount greater than balance" });
    }

    if (actionSelected == "Buy") {
      await buyEtf({ etf: etf.etf, inputAmount: amount });
    } else {
      await sellEtf({ etf: etf.etf, inputAmount: amount });
    }

    await updateBalanceEth();
  };

  const getBalanceAmount = (): number => {
    if (actionSelected == "Sell") {
      return balanceEtf ?? 0;
    }

    return balanceEth;
  };

  return (
    <SidebarBox title="Trade" icon={<Icons.Trade className="size-4.5" />}>
      <div className="w-full flex flex-col gap-2">
        <ActionButtons actionSelected={actionSelected} setActionSelected={setActionSelected} />

        <div className="flex items-center justify-end">
          <WalletBalanceButton
            form={form}
            amount={formData.amount as number}
            balanceEth={balanceEth}
            balanceToken={balanceEtf}
            actionSelected={actionSelected}
            getBalanceAmount={getBalanceAmount}
          />
        </div>

        <TradeForm
          etf={etf}
          form={form}
          formData={formData}
          amount={formData.amount as number}
          handleClick={handleClick}
          loading={loading}
          balanceEth={balanceEth}
          balanceToken={balanceEtf}
          actionSelected={actionSelected}
          getBalanceAmount={getBalanceAmount}
        />

        {/* <div className="w-full pt-2">
          <BalancesBox balanceEth={balanceEth} balanceToken={balanceEtf} />
        </div> */}
      </div>
    </SidebarBox>
  );
};
