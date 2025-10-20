"use client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}

export const useSafeTheme = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setTheme("dark");
  }, []);

  return { hydrated, theme: hydrated ? resolvedTheme : "dark", selectedTheme: theme, setTheme };
};
