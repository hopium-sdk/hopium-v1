import Link from "next/link";
import { Metadata } from "next";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";

export const metadata: Metadata = {
  title: "404 / Hopium",
};

export default function NotFound() {
  const titleClass = cn("text-[6rem] font-bold uppercase");
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <p className={cn(titleClass, "pb-0 rotate-12")}>o</p>
        <p className={cn(titleClass, "pb-5 -rotate-12")}>o</p>
        <p className={cn(titleClass, "pt-6 rotate-12")}>p</p>
        <p className={cn(titleClass, "pb-5 -rotate-12")}>s</p>
        <p className={cn(titleClass, "pt-5 -rotate-12")}>!</p>
      </div>

      <p className="text-md -mt-6">{"This is awkward... this page doesn't exist."}</p>
      <Link href="/" className="mt-10 flex items-center gap-1 underline underline-offset-4 text-main hover:opacity-80">
        Return home
        <Icons.ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
