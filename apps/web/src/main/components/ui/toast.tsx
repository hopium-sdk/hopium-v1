"use client";
import { toast as sonnerToast } from "sonner";
import { Button } from "@/main/shadcn/components/ui/button";
import { Icons } from "@/main/utils/icons";
import Link from "next/link";

export function successToast(toast: Omit<SuccessToastProps, "id">) {
  return sonnerToast.custom((id) => <SuccessToast id={id} title={toast.title} description={toast.description} url={toast.url} urlType={toast.urlType} />);
}

export function previewToast() {
  return sonnerToast.custom(() => <PreviewToast />);
}

function PreviewToast() {
  return (
    <div className="w-full md:min-w-[364px] flex flex-col gap-3 rounded-lg bg-bg-900 border p-4">
      <div className="flex flex-1 items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-green-500">
            <Icons.Clock className="size-4.5" />
            <p className="text-sm font-semibold">Coming soon</p>
          </div>
          <p className="mt-1 text-xs text-subtext">This feature will be coming soon!</p>
        </div>
      </div>
    </div>
  );
}

interface SuccessToastProps {
  id: string | number;
  title: string;
  description: string;
  url?: string;
  urlType?: "internal" | "external";
}

function SuccessToast({ title, description, id, url, urlType }: SuccessToastProps) {
  return (
    <div className="w-full md:min-w-[364px] flex flex-col gap-3 rounded-lg bg-bg-900 border p-4">
      <div className="flex flex-1 items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-green-500">
            <Icons.CheckCircle className="size-4.5" />
            <p className="text-sm font-semibold">{title}</p>
          </div>
          <p className="mt-1 text-xs text-subtext">{description}</p>
        </div>
      </div>
      <div className="">
        {url && urlType ? (
          urlType == "internal" ? (
            <SuccessButton id={id} url={url} urlType={urlType} />
          ) : (
            <Link href={url} target="_blank">
              <SuccessButton id={id} url={url} urlType={urlType} />
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}

const SuccessButton = ({ id, url, urlType }: { id: string | number; url: string; urlType: "internal" | "external" }) => {
  return (
    <Button
      variant={"default"}
      size={"sm"}
      onClick={() => {
        url && urlType == "external" && window.open(url, "_blank");
        sonnerToast.dismiss(id);
      }}
    >
      <Icons.Explorer />
      Solscan
      <Icons.ArrowUpRight />
    </Button>
  );
};
