"use client";
import { CopyIcon } from "@/main/components/ui/copy-icon";
import { Modal } from "@/main/components/ui/modal";
import { Icons } from "@/main/utils/icons";

export const ShareCouponModal = ({ modalOpen, setModalOpen, shareCode }: { modalOpen: boolean; setModalOpen: (open: boolean) => void; shareCode: string }) => {
  const shareLink = window?.location?.origin ? `${window.location.origin}/a/${shareCode}` : "";

  return (
    <Modal title="Share Coupon" modalOpen={modalOpen} setModalOpen={setModalOpen} buttonVisible={false}>
      <div className="flex flex-1 flex-col justify-between overflow-hidden">
        <div className="">
          <p className="text-sm text-subtext font-medium">
            Share this coupon link with your friends and community. When someone uses your link, this coupon will be applied to their trades.
          </p>
          <div className="w-full flex items-center justify-between gap-2 mt-4 bg-bg-900 rounded-base px-4 py-3 text-subtext">
            <div className="flex items-center gap-2 w-full">
              <Icons.Coupon className="size-4.5" />
              <p className="text-sm font-medium w-full truncate">{shareLink}</p>
            </div>
            <CopyIcon
              data={shareLink}
              title="Coupon link copied"
              description="You can now share this link with your friends and community."
              className="text-subtext size-4.5"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
