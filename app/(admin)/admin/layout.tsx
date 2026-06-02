import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="w-full border-b border-zinc-800 bg-zinc-900/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-zinc-100">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{session.user.email}</span>
            <Link
              href="/api/auth/signout"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-100 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">{children}</div>
      </main>
    </div>
  );
}
