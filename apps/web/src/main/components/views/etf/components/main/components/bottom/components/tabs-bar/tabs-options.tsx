import { Icons } from "@/main/utils/icons";

export type T_Tab_Option = "Positions" | "Holders";

export type T_Tab_Options = {
  label: T_Tab_Option;
  icon: React.ElementType;
};

export const etfTabOptions: T_Tab_Options[] = [
  {
    label: "Positions",
    icon: Icons.Activity,
  },
  {
    label: "Holders",
    icon: Icons.Holders,
  },
];
