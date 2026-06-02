"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import ViewToggle from "@/components/layout/ViewToggle";

export default function MinimalHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme ?? theme ?? "light";
  const isDark = currentTheme === "dark";

  return (
    <header className="w-full bg-transparent border-none z-50">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            KA
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-4">
            {/* Professional Mode button */}
            <ViewToggle />

            {/* Dark/Light mode toggle switch */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 dark:bg-zinc-800 transition-colors duration-200 ease-in-out focus:outline-none"
              aria-label="Toggle theme"
            >
              <span
                className={`${
                  isDark ? "translate-x-6 bg-zinc-950" : "translate-x-0 bg-white"
                } pointer-events-none flex h-7 w-7 transform items-center justify-center rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
              >
                {!mounted ? (
                  <div className="w-4 h-4" />
                ) : isDark ? (
                  <Moon className="w-4 h-4 fill-blue-400 text-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
