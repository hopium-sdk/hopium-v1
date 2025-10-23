import { cn } from "@/main/shadcn/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-base", className)} {...props} />;
}

export { Skeleton };
