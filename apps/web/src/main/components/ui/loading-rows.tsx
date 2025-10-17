import { cn } from "../../shadcn/lib/utils";

type T_LoadingRows = {
  num_rows?: number;
  row_height?: string;
  containerClassName?: string;
  rowClassName?: string;
};

export const LoadingRows = ({ num_rows = 10, row_height = "h-10", containerClassName, rowClassName }: T_LoadingRows) => {
  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {Array.from({ length: num_rows }).map((_, index) => (
        <div key={index} className={cn("w-full animate-pulse bg-bg-900/20", row_height, rowClassName)}></div>
      ))}
    </div>
  );
};
