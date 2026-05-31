"use client";

import { Monitor, Type } from "lucide-react";

import { useViewStore } from "@/lib/view-store";

export default function ViewToggle() {
  const mode = useViewStore((state) => state.mode);
  const setMode = useViewStore((state) => state.setMode);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white/80 p-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setMode("minimal")}
        aria-pressed={mode === "minimal"}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
          mode === "minimal"
            ? "bg-black text-white"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        <Type className="h-3.5 w-3.5" />
        Minimal
      </button>
      <button
        type="button"
        onClick={() => setMode("maximized")}
        aria-pressed={mode === "maximized"}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
          mode === "maximized"
            ? "bg-black text-white"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        <Monitor className="h-3.5 w-3.5" />
        Maximized
      </button>
    </div>
  );
}
