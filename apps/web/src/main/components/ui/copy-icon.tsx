import { Icons } from "@/main/utils/icons";
import { useState } from "react";
import { cn } from "@/main/shadcn/lib/utils";

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const CopyIcon = ({ data, className }: { data: string; className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(data);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <>
      {copied ? (
        <Icons.Check className={cn("size-4 text-main", className)} />
      ) : (
        <Icons.Copy className={cn("size-4 text-main hover:text-main/70 cursor-pointer", className)} onClick={handleCopy} />
      )}
    </>
  );
};
