import { cn } from "@/main/shadcn/lib/utils";

export const PingCircle = ({ color, size = 2.5 }: { color?: string; size?: number }) => {
  return (
    <span className={cn("relative flex size-2.5", `size-${size}`)}>
      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75", color)}></span>
      <span className={cn("relative inline-flex size-2.5 rounded-full bg-green-500", color, `size-${size}`)}></span>
    </span>
  );
};
