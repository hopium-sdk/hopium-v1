"use client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}

export const useSafeTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setTheme("dark");
  }, []);

  return { hydrated, theme: hydrated ? resolvedTheme : "dark", setTheme };
};
