"use client";

import type { ReactNode } from "react";

import { useViewStore } from "@/lib/view-store";
import MinimalViewShell from "@/components/views/minimal/MinimalViewShell";
import MaximizedViewShell from "@/components/views/maximized/MaximizedViewShell";

type ViewShellProps = {
  children: ReactNode;
};

export default function ViewShell({ children }: ViewShellProps) {
  const mode = useViewStore((state) => state.mode);

  if (mode === "maximized") {
    return <MaximizedViewShell>{children}</MaximizedViewShell>;
  }

  return <MinimalViewShell>{children}</MinimalViewShell>;
}
