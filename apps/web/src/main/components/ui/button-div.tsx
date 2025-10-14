import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/shadcn/lib/utils";
import { buttonVariants } from "@/shadcn/components/ui/button";

type ButtonDivProps = React.ComponentProps<"div"> & VariantProps<typeof buttonVariants>;

function ButtonDiv({ className, variant, size, ...props }: ButtonDivProps) {
  return <div className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { ButtonDiv };
