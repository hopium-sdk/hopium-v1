import Logo from "./logo";
import { cn } from "@/main/shadcn/lib/utils";

export const LoadingDiv = ({ logoSize = "size-8", className }: { logoSize?: string; className?: string }) => {
  return (
    <div className={cn("flex flex-1 items-center justify-center lg:rounded-box bg-bg", className)}>
      <Logo className={cn("rotate", logoSize)} color="var(--fg)" variant="outline" />
    </div>
  );
};
