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

      {/* Projects Table */}
      {projects.length === 0 ? (
        <div className="rounded-none border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-xs text-zinc-500">No projects added yet.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto border border-zinc-850 bg-zinc-900/10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 uppercase font-bold tracking-wider">
                <th className="p-4 w-20">Cover</th>
                <th className="p-4">Title</th>
                <th className="p-4">Role</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-zinc-900/20 transition-colors align-middle"
                >
                  <td className="p-4">
                    {project.coverImage ? (
                      <div className="w-12 aspect-video bg-zinc-900 border border-zinc-800 overflow-hidden relative">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 aspect-video bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] text-zinc-600 font-bold uppercase">
                        None
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-zinc-200">
                    <div className="flex items-center gap-2">
                      <span>{project.title}</span>
                      {project.featured && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 border border-yellow-500/20">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">
                    {project.role || <span className="text-zinc-600 font-normal italic">Not specified</span>}
                  </td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate">
                    {project.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[9px] text-zinc-600 font-bold self-center">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-zinc-600 italic">None</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center px-3 py-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors rounded-none"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
