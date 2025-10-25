import { Icons } from "@/main/utils/icons";
import { TOAST } from "./toast/toast";
import { cn } from "@/main/shadcn/lib/utils";

type T_CopyIcon = {
  data: string;
  title?: string;
  description?: string;
  className?: string;
};
export const CopyIcon = ({ data, title, description, className }: T_CopyIcon) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(data);
    TOAST.showSuccessToast({
      title: title ?? "Address copied",
      description: description ?? "The address has been copied to your clipboard",
    });
  };

  return <Icons.Copy className={cn("size-4 cursor-pointer text-main hover:opacity-70", className)} onClick={copyAddress} />;
};
