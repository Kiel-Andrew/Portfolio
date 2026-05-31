import type { ReactNode } from "react";

import SiteHeader from "@/components/layout/SiteHeader";

type MaximizedViewShellProps = {
  children: ReactNode;
};

export default function MaximizedViewShell({
  children,
}: MaximizedViewShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
