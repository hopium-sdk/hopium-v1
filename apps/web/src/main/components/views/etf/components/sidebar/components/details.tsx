import { Icons } from "@/main/utils/icons";
import { Timestamp } from "@/main/components/ui/timestamp";
import { CopyIcon } from "@/main/components/ui/copy-icon";
import { C_EtfWithAssetsAndPools } from "@repo/convex/schema";
import { Avatar } from "@/main/components/ui/avatar";
import { SidebarBox } from "../ui/box";
import { cn } from "@/main/shadcn/lib/utils";

export const EtfDetails = ({ etf }: { etf: C_EtfWithAssetsAndPools }) => {
  const options = ["Token", "Vault"];

  const css = {
    title: "text-sm font-medium text-subtext",
    value: "text-sm font-medium",
  };

  return (
    <SidebarBox title="Contracts" icon={<Icons.Details className="size-4.5" />}>
      <div className="w-full flex flex-col bg-bg-900 rounded-base overflow-hidden">
        {options.map((option, index) => (
          <div key={index} className={cn("w-full flex items-center justify-between py-1.5 px-4", index < options.length - 1 ? "border-b-2 border-bg-800" : "")}>
            <div className="w-4/12 flex flex-col">
              <p className={css.title}>{option}</p>
            </div>
            <div className="w-8/12 flex flex-col items-end">
              {option === "Created" ? (
                <Timestamp timestamp={etf.etf.details.createdAt} className={css.value} color="text-subtext" withLink={false} />
              ) : (
                <div className="flex items-center justify-end gap-2">
                  {
                    <>
                      <Avatar
                        address={option === "Token" ? (etf.etf.contracts.etfTokenAddress ?? "") : (etf.etf.contracts.etfVaultAddress ?? "")}
                        withLink
                        withLinkColor
                        withLinkIcon
                        iconVariant="contract"
                      />
                      <CopyIcon data={option === "Token" ? (etf.etf.contracts.etfTokenAddress ?? "") : (etf.etf.contracts.etfVaultAddress ?? "")} />
                    </>
                  }
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SidebarBox>
  );
};
