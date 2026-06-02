"use client";

import { Briefcase, Paintbrush } from "lucide-react";
import { useViewStore } from "@/lib/view-store";

export default function ViewToggle() {
  const mode = useViewStore((state) => state.mode);
  const setMode = useViewStore((state) => state.setMode);

  return (
    <button
      onClick={() => setMode(mode === "minimal" ? "maximized" : "minimal")}
      className="inline-flex items-center gap-2 rounded-none px-4 py-2 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition shadow-sm backdrop-blur-sm"
      aria-label="Toggle view mode"
    >
      {mode === "minimal" ? (
        <>
          <Briefcase className="h-3.5 w-3.5 text-zinc-800 dark:text-zinc-200" />
          <span>Professional Mode</span>
        </>
      ) : (
        <>
          <Paintbrush className="h-3.5 w-3.5 text-zinc-800 dark:text-zinc-200" />
          <span>Creative Mode</span>
        </>
      )}
    </button>
  );
}
