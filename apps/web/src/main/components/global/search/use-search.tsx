import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useSearch = ({ isMobile }: { isMobile?: boolean }) => {
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
        if (!isMobile) {
          router.replace("/");
          return;
        }
      } else {
        return;
      }
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

  return { value, setValue };
};
