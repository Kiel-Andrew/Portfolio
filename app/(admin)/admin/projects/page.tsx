import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, FolderGit, Plus } from "lucide-react";
import ProjectsTable from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Projects | Admin",
};

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" }
    ],
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
            Manage your portfolio projects, images, videos, and descriptions. Drag rows to reorder.
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
        <ProjectsTable projects={projects} />
      )}
    </div>
  );
}
