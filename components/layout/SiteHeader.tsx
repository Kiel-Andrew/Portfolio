import Link from "next/link";

import ViewToggle from "@/components/layout/ViewToggle";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900"
          >
            Kiel Andrew
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
            <Link href="/projects" className="transition hover:text-zinc-900">
              Projects
            </Link>
            <Link href="/experience" className="transition hover:text-zinc-900">
              Experience
            </Link>
          </nav>
        </div>
        <ViewToggle />
      </div>
    </header>
  );
}
