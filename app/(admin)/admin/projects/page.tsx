import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, FolderGit, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Projects | Admin",
};

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({
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
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Manage your portfolio projects, images, videos, and descriptions
          </p>
        </div>
        <Link
          href="/admin/projects/create"
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-none transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </Link>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="rounded-none border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-xs text-zinc-500">No projects added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-start justify-between border border-zinc-800 bg-zinc-900/20 p-4 rounded-none hover:border-zinc-700/60 transition-colors group gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-1 p-2 bg-zinc-900 border border-zinc-800 text-zinc-400">
                  <FolderGit className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100 truncate">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-2 py-0.5 border border-yellow-500/20">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {project.role ? `Role: ${project.role}` : project.tags.slice(0, 3).join(", ")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="px-3 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors rounded-none"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
