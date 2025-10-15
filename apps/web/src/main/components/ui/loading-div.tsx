import Logo from "./logo";
import { cn } from "@/main/shadcn/lib/utils";

export const LoadingDiv = ({ logoSize = "size-8" }: { logoSize?: string }) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Logo className={cn("rotate", logoSize)} color="var(--fg)" />
    </div>
  );
};
