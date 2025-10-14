"use client";
import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/main/shadcn/components/ui/dropdown-menu";
import { cn } from "@/main/shadcn/lib/utils";
import { useSafeTheme } from "@/main/wrappers/components/theme-provider";

const themeIcons = {
  light: <Sun className="w-4.5 h-4.5 md:w-4 md:h-4 scale-100 dark:scale-0" />,
  dark: <Moon className="absolute w-4.5 h-4.5 md:w-4 md:h-4 scale-0 dark:scale-100" />,
};

const themeOptions = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeToggle({ withBox = true }: { withBox?: boolean }) {
  const { setTheme } = useSafeTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "cursor-pointer flex items-center justify-center rounded-md outline-none border-none text-subtext hover:text-foreground w-8.5 h-8.5",
            withBox && "bg-primary-foreground"
          )}
        >
          {themeIcons.light}
          {themeIcons.dark}
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="border-none">
        {themeOptions.map(({ value, label, Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)} className="flex items-center gap-2 text-subtext hover:text-foreground">
            <Icon className="h-[1.2rem] w-[1.2rem]" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
