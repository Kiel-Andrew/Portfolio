import type { ReactNode } from "react";

import SiteHeader from "@/components/layout/SiteHeader";

type MinimalViewShellProps = {
  children: ReactNode;
};

export default function MinimalViewShell({ children }: MinimalViewShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
