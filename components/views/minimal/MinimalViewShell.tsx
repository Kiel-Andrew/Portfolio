import type { ReactNode } from "react";

import SiteHeader from "@/components/layout/SiteHeader";

type MinimalViewShellProps = {
  children: ReactNode;
};

export default function MinimalViewShell({ children }: MinimalViewShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-6 py-12">{children}</div>
      </main>
    </div>
  );
}
