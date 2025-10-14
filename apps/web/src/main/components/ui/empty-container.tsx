import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";

export const EmptyContainerVariants = {
  default: {
    label: "Oops!",
    description: "There's nothing here",
    icon: Icons.Empty,
  },
  emptyTokenList: {
    label: "No tokens found",
    description: "Try a different search",
    icon: Icons.Search,
  },
};

type T_EmptyContainer = {
  label?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  cssVariant?: keyof typeof EmptyContainerCssVariants;
  labelVariant?: keyof typeof EmptyContainerVariants;
};

export const EmptyContainerCssVariants = {
  default: {
    label: "text-sm",
    description: "text-xs",
    icon: "text-3xl",
  },
  lg: {
    label: "text-md",
    description: "text-sm",
    icon: "text-5xl",
  },
};

export const EmptyContainer = ({
  label,
  description,
  icon,
  iconClassName,
  labelClassName,
  descriptionClassName,
  cssVariant = "default",
  labelVariant = "default",
}: T_EmptyContainer) => {
  const defaultCss = {
    label: "font-medium",
    description: "max-w-md text-subtext",
    icon: "",
  };

  const Icon = icon ?? EmptyContainerVariants[labelVariant].icon;

  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-4">
      {Icon && <Icon className={cn(defaultCss.icon, EmptyContainerCssVariants[cssVariant].icon, iconClassName)} />}
      <div className="flex flex-col gap-2 items-center">
        <p className={cn(defaultCss.label, EmptyContainerCssVariants[cssVariant].label, labelClassName)}>
          {label ? label : EmptyContainerVariants[labelVariant].label}
        </p>
        <p className={cn(defaultCss.description, EmptyContainerCssVariants[cssVariant].description, descriptionClassName)}>
          {description ? description : EmptyContainerVariants[labelVariant].description}
        </p>
      </div>
    </div>
  );
};
