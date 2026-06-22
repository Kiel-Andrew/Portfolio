import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/admin/SidebarNav";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Load unread count from the DB for the sidebar badge
  const unreadCount = await prisma.message.count({
    where: { read: false },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      <SidebarNav email={session.user.email} unreadCount={unreadCount} />
      
      {/* Scrollable content area on desktop */}
      <main className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 p-6 sm:p-8 md:p-10 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
