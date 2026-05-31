import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Kiel Andrew",
};

export default async function AdminDashboard() {
  const projectCount = await prisma.project.count();
  const experienceCount = await prisma.experience.count();
  const certCount = await prisma.certification.count();
  const techCount = await prisma.techStack.count();

  const stats = [
    { label: "Projects", count: projectCount, href: "/admin/projects" },
    {
      label: "Experience",
      count: experienceCount,
      href: "/admin/experience",
    },
    {
      label: "Certifications",
      count: certCount,
      href: "/admin/certifications",
    },
    { label: "Tech Stack", count: techCount, href: "/admin/tech-stack" },
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400">Manage your portfolio content</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-8 hover:border-zinc-600 hover:bg-zinc-800/60 transition"
          >
            <div className="text-3xl font-bold text-zinc-100">
              {stat.count}
            </div>
            <div className="mt-2 text-sm font-medium text-zinc-400">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="space-y-4 border-t border-zinc-800 pt-12">
        <h2 className="text-2xl font-bold text-zinc-100">Quick Links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/projects"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-100 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
          >
            Manage Projects
          </Link>
          <Link
            href="/admin/experience"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-100 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
          >
            Manage Experience
          </Link>
          <Link
            href="/admin/certifications"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-100 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
          >
            Manage Certifications
          </Link>
          <Link
            href="/admin/tech-stack"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-100 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
          >
            Manage Tech Stack
          </Link>
        </div>
      </div>
    </div>
  );
}
