"use client";
import { Input } from "@/main/shadcn/components/ui/input";
import { Icons } from "@/main/utils/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState(searchParams.get("query") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // clear any pending navigation
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const trimmed = value.trim();

    if (trimmed === "") {
      if (pathname.startsWith("/search")) {
        router.replace("/");
      }
      return;
    }

    // debounce the navigation
    timerRef.current = setTimeout(() => {
      const onSearch = pathname.startsWith("/search");
      if (onSearch) {
        const next = new URLSearchParams(searchParams.toString());
        next.set("query", trimmed);
        router.replace(`${pathname}?${next.toString()}`);
      } else {
        router.replace(`/search?query=${encodeURIComponent(trimmed)}`);
      }
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value]);

  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setValue("");
    }
  }, [pathname]);

  return (
    <div className="border rounded-md px-4 h-10 flex items-center justify-between gap-2 text-subtext w-full max-w-sm">
      <div className="w-full flex items-center gap-2">
        <Icons.Search />
        <Input className="w-full" placeholder="Search" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
};
