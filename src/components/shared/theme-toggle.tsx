"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  size?: "sm" | "md";
};

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const dim = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconDim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400",
          dim,
          className,
        )}
      >
        <Sun className={iconDim} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
        dim,
        className,
      )}
    >
      {isDark ? <Sun className={iconDim} /> : <Moon className={iconDim} />}
    </button>
  );
}
