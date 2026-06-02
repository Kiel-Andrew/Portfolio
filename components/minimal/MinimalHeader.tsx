"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";

export default function MinimalHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme ?? theme ?? "light";
  const isDark = currentTheme === "dark";

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-4 sm:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            KA
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-4">
            {/* Professional Mode button */}
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-not-allowed opacity-60"
              aria-label="Professional mode (coming soon)"
              disabled
              title="Professional mode - coming soon"
            >
              <Zap className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-5 h-5" />
              ) : isDark ? (
                <Sun className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
