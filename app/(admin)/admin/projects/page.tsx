import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Projects | Admin",
};

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">Projects</h1>
          <p className="text-zinc-400">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/create"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
        >
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-12 text-center">
          <p className="text-zinc-400">No projects yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/40 p-4 hover:bg-zinc-800/60 transition"
            >
              <div className="flex-1">
                <h3 className="font-medium text-zinc-100">{project.title}</h3>
                <p className="text-sm text-zinc-500">{project.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                {project.featured && (
                  <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                )}
                <a
                  href={`/admin/projects/${project.id}`}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
                >
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
