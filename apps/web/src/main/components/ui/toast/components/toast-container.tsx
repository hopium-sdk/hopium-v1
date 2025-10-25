import { Button } from "@/main/shadcn/components/ui/button";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import Link from "next/link";
import { toast as sonnerToast } from "sonner";

export type T_ToastContainer = {
  id: string | number;
  title: string;
  description?: string;
  url?: string;
  urlType?: "internal" | "external";
  icon?: React.ReactNode;
  buttonVisible?: boolean;
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  color?: string;
};

export const ToastContainer = ({ id, title, description, url, urlType, icon, buttonVisible = false, buttonIcon, buttonText, color }: T_ToastContainer) => {
  return (
    <div className={cn("relative w-full md:min-w-[364px] flex flex-col rounded-base bg-bg border p-4", buttonVisible ? "gap-3" : "")}>
      <div className="w-full flex flex-1 items-center">
        <div className="w-full flex flex-col gap-1">
          <div className="w-full flex items-center justify-between">
            <div className={cn("flex items-center gap-1.5", color ? color : "text-green-500")}>
              {icon ?? <Icons.CheckCircle className="size-4.5" />}
              <p className="text-sm font-medium">{title}</p>
            </div>
            <button onClick={() => sonnerToast.dismiss(id)} className="text-subtext hover:text-white transition-colors" aria-label="Dismiss">
              <Icons.X className="size-5" />
            </button>
          </div>
          {description ? <p className="mt-1 text-xs text-subtext">{description}</p> : null}
        </div>
      </div>

      {buttonVisible ? (
        <div>
          {url && urlType ? (
            urlType === "internal" ? (
              <ToastButton id={id} url={url} urlType={urlType} icon={buttonIcon} text={buttonText} />
            ) : (
              <Link href={url} target="_blank">
                <ToastButton id={id} url={url} urlType={urlType} icon={buttonIcon} text={buttonText} />
              </Link>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export type T_ToastButton = {
  id: string | number;
  url: string;
  urlType: "internal" | "external";
  icon?: React.ReactNode;
  text?: string;
};

const ToastButton = ({ id, url, urlType, icon, text }: T_ToastButton) => {
  const handleClick = () => {
    if (url && urlType === "external") {
      window.open(url, "_blank");
    }
    sonnerToast.dismiss(id);
  };

  return (
    <Button variant="default" size="sm" onClick={handleClick}>
      {icon ?? <Icons.Explorer />}
      {text ?? "Solscan"}
      <Icons.ArrowUpRight />
    </Button>
  );
};
