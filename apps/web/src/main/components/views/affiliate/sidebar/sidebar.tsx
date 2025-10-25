import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";

const AFFILIATE_INFO = [
  {
    title: "Hopium Affiliate Program",
    content: ["Earn rewards by sharing Hopium with your friends and community."],
  },
  {
    title: "How It Works",
    content: [
      "Invite others to trade on Hopium using your unique coupon link.",
      "When someone signs up and trades with your code:",
      "• They save <highlight>25% on their trading fees<highlight>.",
      "• You earn <highlight>50% of their trading fees<highlight> — automatically.",
      "The more active traders you refer, the more you earn.",
    ],
  },
  {
    title: "How to Join",
    content: [
      "1. Generate your coupon code in this section.",
      "2. Share your referral link with friends, followers, or your community.",
      "3. When they start trading, you'll begin earning instantly.",
    ],
  },
  {
    title: "Earnings & Payouts",
    content: [
      "• You earn 50% of the trading fees from every trade made by your referrals.",
      "• Rewards are paid automatically in <highlight>Ether (ETH)<highlight> — no claims or withdrawals needed.",
      "• Every time your referred user completes a transaction, your share is instantly sent to your wallet.",
    ],
  },
  {
    title: "Example",
    content: [
      "If your friend trades using your coupon:",
      "• They pay 25% less in fees.",
      "• You receive 50% of the (discounted) fee amount — directly to your wallet.",
    ],
  },
];

export const AffiliateSidebar = () => {
  return (
    <div className="w-full flex flex-1 flex-col overflow-y-auto px-6 py-4">
      {/* Header Graphic */}
      <div className="w-full h-[150px] bg-teal-200/50 dark:bg-teal-900/50 rounded-base flex items-center justify-center">
        <Icons.Coupon className="size-30 text-teal-500" />
      </div>

      {/* Info Sections */}
      <div className="w-full flex flex-col gap-6 mt-6">
        {AFFILIATE_INFO.map((section, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className={cn("font-medium", index === 0 ? "text-md" : "text-sm")}>{section.title}</p>
            {section.content.map((line, i) => (
              <p key={i} className="text-sm text-subtext">
                {line.split("<highlight>").map((part, index) => (
                  <span key={index} className={index % 2 === 0 ? "text-subtext" : "text-teal-500"}>
                    {part}
                  </span>
                ))}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
