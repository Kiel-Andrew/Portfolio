import { prisma } from "@/lib/prisma";
import InboxView from "@/components/admin/InboxView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inbox | Admin",
};

export default async function AdminInboxPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back to Dashboard */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
          Inbox
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Read and manage messages sent from your portfolio website
        </p>
      </div>

      {/* Inbox Component */}
      <InboxView initialMessages={messages} />
    </div>
  );
}
