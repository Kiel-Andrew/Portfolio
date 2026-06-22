"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderGit, Briefcase, Award, Cpu, Mail, LayoutDashboard, LogOut, Menu, X, ArrowLeft } from "lucide-react";

interface SidebarNavProps {
  email: string;
  unreadCount: number;
}

export default function SidebarNav({ email, unreadCount }: SidebarNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Inbox", href: "/admin/inbox", icon: Mail, badge: unreadCount },
    { label: "Projects", href: "/admin/projects", icon: FolderGit },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Certifications", href: "/admin/certifications", icon: Award },
    { label: "Tech Stack", href: "/admin/tech-stack", icon: Cpu },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 text-zinc-100 sticky top-0 z-30">
        <span className="font-bold text-xs uppercase tracking-wider">Admin Panel</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors rounded-none"
        >
          <Menu className="w-4 h-4" />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 text-zinc-300 transform transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <div>
            <h2 className="font-bold text-zinc-100 text-sm uppercase tracking-wider">Kiel Andrew</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-normal truncate max-w-[180px]">{email}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none border transition-colors group ${
                  isActive
                    ? "bg-zinc-100 border-zinc-100 text-zinc-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-zinc-950" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-none border ${
                    isActive 
                      ? "bg-zinc-950 border-zinc-950 text-zinc-100" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full py-2 border border-zinc-900 hover:border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Public Site
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center justify-center gap-1.5 w-full py-2 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
