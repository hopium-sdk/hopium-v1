import { cn } from "@/main/shadcn/lib/utils";
import { Modal } from "../../ui/modal";
import { Coin } from "../../ui/graphics/coin/coin";
import { cursiveFont } from "@/main/utils/fonts";
import { Icons } from "@/main/utils/icons";
import { useAccount } from "wagmi";

type T_RewardsModal = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  rewards: number | undefined;
};
export const RewardsModal = ({ modalOpen, setModalOpen, rewards }: T_RewardsModal) => {
  const { address } = useAccount();

  return (
    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} title="$HOP Rewards" buttonVisible={false}>
      <div className="flex flex-1 flex-col gap-4 overflow-hidden min-h-[300px]">
        <div className={cn("relative w-full h-[200px] flex items-center justify-center bg-rewards-900/50 rounded-base py-6 overflow-hidden")}>
          <div className="w-full h-full flex flex-1 items-center justify-center z-10">
            <Coin />
          </div>
          <div className="absolute top-0 left-0 w-full h-full z-0 flex flex-1 items-center justify-center">
            <p className={cn("text-[110px] text-text font-medium", cursiveFont.className)}>Rewards</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <p className={cn("text-lg text-text font-medium")}>How to win rewards on Hopium</p>
          <p className={cn("text-sm text-subtext font-medium mt-2")}>
            Every trade you make on Hopium earns you rewards based on your trading volume. You can easily track your accumulated rewards here. Once $HOP
            officially launches, your rewards will be automatically converted into $HOP tokens.
          </p>

          <div className="flex items-center justify-between mt-4 border-t-2 pt-4">
            {address && rewards != undefined ? (
              <>
                <p className={cn("text-sm text-text font-medium")}>Your rewards so far :</p>
                <div className="flex items-center justify-center gap-2 text-rewards bg-rewards-900 px-4 py-1 rounded-base">
                  <Icons.Rewards className="size-4" />
                  <p className={cn("text-md font-medium")}>{rewards?.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-subtext">
                <Icons.Info className="size-4" />
                <p className={cn("text-sm font-medium")}>Connect wallet to see your rewards</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
