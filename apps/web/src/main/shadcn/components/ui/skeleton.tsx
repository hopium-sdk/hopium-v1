import { cn } from "@/main/shadcn/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-box", className)} {...props} />;
}

export { Skeleton };
