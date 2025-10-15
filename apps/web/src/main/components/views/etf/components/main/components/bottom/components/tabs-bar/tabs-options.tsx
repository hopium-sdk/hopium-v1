import { Icons } from "@/main/utils/icons";

export type T_Tab_Option = "Positions" | "Holders" | "Vault";

export type T_Tab_Options = {
  label: T_Tab_Option;
  icon: React.ReactNode;
};

export const etfTabOptions: T_Tab_Options[] = [
  {
    label: "Positions",
    icon: <Icons.Positions />,
  },
  {
    label: "Holders",
    icon: <Icons.Holders className="size-3.75" />,
  },
  {
    label: "Vault",
    icon: <Icons.Vault />,
  },
];
