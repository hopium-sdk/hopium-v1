import { Icons } from "@/main/utils/icons";
import { Timestamp } from "@/main/components/ui/timestamp";
import { CopyIcon } from "@/main/components/ui/copy-icon";
import { C_Etf } from "@repo/convex/schema";
import { Avatar } from "@/main/components/ui/avatar";

export const EtfDetails = ({ etf }: { etf: C_Etf }) => {
  const options = ["Created", "Token", "Vault"];

  const css = {
    title: "text-sm font-medium text-subtext",
    value: "text-sm font-medium",
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 pb-1">
        <Icons.Details className="text-subtext" />
        <p className="text-2xs font-semibold uppercase text-subtext">Details</p>
      </div>
      <div className="w-full border-b">
        {options.map((option) => (
          <div key={option} className="w-full flex items-center justify-between border-t py-2">
            <div className="w-4/12 flex flex-col">
              <p className={css.title}>{option}</p>
            </div>
            <div className="w-8/12 flex flex-col items-end">
              {option === "Created" ? (
                <Timestamp timestamp={etf.index.createdAt} className={css.value} color="text-subtext" withLink={false} />
              ) : (
                <div className="flex items-center justify-end gap-2">
                  {
                    <>
                      <Avatar
                        address={option === "Token" ? (etf.contracts.etfTokenAddress ?? "") : (etf.contracts.etfVaultAddress ?? "")}
                        withLink
                        withLinkColor
                        withLinkIcon
                      />
                      <CopyIcon data={option === "Token" ? (etf.contracts.etfTokenAddress ?? "") : (etf.contracts.etfVaultAddress ?? "")} />
                    </>
                  }
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
